import * as C from './constants';
import * as i from './interfaces';
import { Side } from './constants';
import * as CPU from './CPU';
import { Injectable } from '@nestjs/common';
import { MatchRepository } from './match/match.repository';

@Injectable()
export class GameLogicService {
	constructor(private readonly matchRepo: MatchRepository) {}

	async runGame(socket: any, state: i.GameState, canvas: i.Canvas) {
		if (!state.match) {
			state.match = await this.matchRepo.initNewMatch();
			if (state.match)
				socket.emit('players', state.match.players);
			else
				socket.emit('noPlayers');
		}

		setInterval(() => {
			if (!state.match) return;
			this.handleEndOfGame(socket, state);
			CPU.Action(state);
			this.handleCollisions(canvas, state);
			this.handleScore(canvas, state, socket);
			socket.emit('gameState', state);
		}, 1000 / 24);
	}

	serveBall(socket: any, state: i.GameState): void {
		state.ballIsInPlay = true;
		console.log('Ball is in play');
		socket.emit('gameScore', state.match);

		if (state.serveLeft.state) state.ball.xSpeed = C.BALL_SPEED;
		if (state.serveRight.state) state.ball.xSpeed = -C.BALL_SPEED;
		state.serveRight.state = false;
		state.serveLeft.state = false;
	}

	private async handleEndOfGame(socket: any, state: i.GameState) {
		if (
			state.isStarted &&
			state.match.playerOneScore >= C.MAX_SCORE ||
			state.match.playerTwoScore >= C.MAX_SCORE
		) {
			state.isStarted = false;
			try {
				const savedMatch = await this.matchRepo.saveMatch(state.match);
				socket.emit('endOfGame', savedMatch);
				console.log(savedMatch);
				state.match = await this.matchRepo.initNewMatch();
				console.log('Successfully saved');
				if (state.match)
					socket.emit('players', state.match.players);
				else
					socket.emit('noPlayers');
			} catch (error) {
				console.log('Error saving GameScore', error);
			}
		}
	}

	private handleScore(canvas: i.Canvas, state: i.GameState, socket: any) {
		const ballIsBehindLeftPaddle = state.ball.x < canvas.ballDiameter / 2;
		const ballIsBehindRightPaddle =
			state.ball.x + canvas.ballDiameter / 2 > canvas.width;

		if (ballIsBehindLeftPaddle) {
			state.match.playerTwoScore += 1;
			state.serveLeft.state = true;
			socket.emit('setScorePlayerTwo', state.match.playerTwoScore);
		}

		if (ballIsBehindRightPaddle) {
			state.match.playerOneScore += 1;
			state.serveRight.state = true;
			socket.emit('setScorePlayerOne', state.match.playerOneScore);
		}

		if (ballIsBehindLeftPaddle || ballIsBehindRightPaddle) {
			state.ballIsInPlay = false;
		}
	}

	private handleCollisions(canvas: i.Canvas, state: i.GameState) {
		this.boundPaddleToWindow(canvas, state.paddleLeft);
		this.boundPaddleToWindow(canvas, state.paddleRight);

		if (state.ballIsInPlay) {
			this.moveBall(state);

			this.handleCollisionPaddle(canvas, state, Side.left);
			this.handleCollisionPaddle(canvas, state, Side.right);
			this.handleBounceTopBottom(canvas, state);
		}

		if (!state.ballIsInPlay) this.moveBallDuringServe(canvas, state);
	}

	private moveBall(state: i.GameState) {
		state.ball.x += state.ball.xSpeed;
		state.ball.y += state.ball.ySpeed;
	}

	private handleCollisionPaddle(
		canvas: i.Canvas,
		state: i.GameState,
		side: number,
	): void {
		if (!this.checkIfBallHitsPaddle(canvas, state, side)) return;
		this.redirectUpOrDownBasedOnPositionOfPaddleHit(state, side);
	}

	private checkIfBallHitsPaddle(
		canvas: i.Canvas,
		state: i.GameState,
		side: number,
	): boolean {
		const paddle = this.getPaddleBySide(state, side);

		const offset =
			canvas.paddleWidth + canvas.borderOffset + canvas.ballDiameter / 2;
		const ballIsAbovePaddle = state.ball.y > paddle.y + paddle.height;
		const ballIsBelowPaddle = state.ball.y < paddle.y;
		const ballIsAtLeftLine = state.ball.x <= paddle.x + offset;
		const ballIsAtRightLine = state.ball.x >= canvas.width - offset;

		if (side === Side.left)
			return ballIsAtLeftLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
		return ballIsAtRightLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
	}

	private redirectUpOrDownBasedOnPositionOfPaddleHit(
		state: i.GameState,
		side: number,
	) {
		const paddle = this.getPaddleBySide(state, side);

		const topOfPaddle = paddle.y + paddle.height;
		const centerOfPaddle = paddle.y + 0.5 * paddle.height;
		const bottomOfPaddle = paddle.y;

		const ballHitsUpperHalf =
			state.ball.y >= centerOfPaddle && state.ball.y <= topOfPaddle;
		const ballHitsLowerHalf =
			state.ball.y >= bottomOfPaddle && state.ball.y < centerOfPaddle;

		if (side === Side.left) state.ball.xSpeed = C.BALL_SPEED;
		if (side === Side.right) state.ball.xSpeed = -C.BALL_SPEED;
		if (ballHitsLowerHalf) state.ball.ySpeed = -C.BALL_SPEED;
		if (ballHitsUpperHalf) state.ball.ySpeed = C.BALL_SPEED;
	}

	private getPaddleBySide(state: i.GameState, side: number): i.Paddle {
		if (side === Side.left) return state.paddleLeft;
		return state.paddleRight;
	}

	private handleBounceTopBottom(canvas: i.Canvas, state: i.GameState): void {
		const ballHitsTopOrBottom =
			state.ball.y < canvas.ballDiameter / 2 ||
			state.ball.y > canvas.height - canvas.ballDiameter;
		if (ballHitsTopOrBottom) state.ball.ySpeed *= -1;
	}

	private boundPaddleToWindow(canvas: i.Canvas, paddle: i.Paddle) {
		if (paddle.y <= 0) paddle.y = 0;
		if (paddle.y + paddle.height >= canvas.height)
			paddle.y = canvas.height - paddle.height;
	}

	private moveBallDuringServe(canvas: i.Canvas, state: i.GameState) {
		const { serveLeft, serveRight, paddleLeft, paddleRight, ball } = state;
		ball.xSpeed = 0;
		if (serveLeft.state) {
			ball.x = paddleLeft.x + canvas.paddleWidth + canvas.ballDiameter / 2;
			ball.y = paddleLeft.y + 0.5 * paddleLeft.height;
		}
		if (serveRight.state) {
			ball.x = paddleRight.x - canvas.ballDiameter / 2;
			ball.y = paddleRight.y + 0.5 * paddleRight.height;
		}
	}
}

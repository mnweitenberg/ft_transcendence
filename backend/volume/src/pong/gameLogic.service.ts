import * as C from './constants';
import * as i from './interfaces';
import { P } from './constants';
import { Injectable } from '@nestjs/common';
import { MatchRepository } from './match/match.repository';

@Injectable()
export class GameLogicService {
	constructor(private readonly matchRepo: MatchRepository) {
		this.width = C.WIDTH;
		this.height = C.HEIGHT;
		this.paddleWidth = C.PADDLE_HEIGHT;
		this.ballDiameter = C.BALL_DIAMETER;
		this.borderOffset = C.BORDER_OFFSET;
	}
	private width: number;
	private height: number;
	private paddleWidth: number;
	private ballDiameter: number;
	private borderOffset: number;

	async runGame(state: i.GameState): Promise<void> {
		if (!state.match) return;
		state.isStarted = true;
		console.log(
			state.match.players[P.One].username,
			state.match.players[P.Two].username,
		);
		// setInterval(() => {
		if (!state.match) return;
		this.handleEndOfGame(state);
		this.handleCollisions(state);
		this.handleScore(state);
		// socket.emit('gameState', state);
		// }, 1000 / 24);
	}

	serveBall(state: i.GameState): void {
		if (!state.isStarted || state.ballIsInPlay) return;
		state.p1.isServing = false;
		state.p2.isServing = false;
		state.ballIsInPlay = true;
		console.log('Ball is in play');
	}

	private async handleEndOfGame(state: i.GameState) {
		if (
			(state.isStarted && state.match.playerOneScore >= C.MAX_SCORE) ||
			state.match.playerTwoScore >= C.MAX_SCORE
		) {
			state.isStarted = false;
			console.log(state.match);
			try {
				const savedMatch = await this.matchRepo.saveMatch(state.match);
				console.log(savedMatch);
				console.log('Successfully saved');
			} catch (error) {
				console.log('Error saving GameScore', error);
			}
		}
	}

	private handleScore(state: i.GameState) {
		const ballIsBehindLeftPaddle = state.ball.x < this.ballDiameter / 2;
		const ballIsBehindRightPaddle =
			state.ball.x + this.ballDiameter / 2 > this.width;

		if (ballIsBehindLeftPaddle) {
			state.match.playerTwoScore += 1;
			state.p1.isServing = true;
		}

		if (ballIsBehindRightPaddle) {
			state.match.playerOneScore += 1;
			state.p2.isServing = true;
		}

		if (ballIsBehindLeftPaddle || ballIsBehindRightPaddle) {
			console.log(state.match.playerOneScore, state.match.playerTwoScore);
			state.ballIsInPlay = false;
		}
	}

	private handleCollisions(state: i.GameState) {
		this.boundPaddleToWindow(state.p1.paddle);
		this.boundPaddleToWindow(state.p2.paddle);

		if (state.ballIsInPlay) {
			this.moveBall(state);

			this.handleCollisionPaddle(state, P.One);
			this.handleCollisionPaddle(state, P.Two);
			this.handleBounceTopBottom(state);
		}

		if (state.isStarted && !state.ballIsInPlay) {
			this.moveBallDuringServe(state);
			if (state.p1.isServing || state.p2.isServing)
				setTimeout(() => this.serveBall(state), C.TIMEMOUT);
		}
	}

	private moveBall(state: i.GameState) {
		state.ball.x += state.ball.xSpeed;
		state.ball.y += state.ball.ySpeed;
	}

	private handleCollisionPaddle(state: i.GameState, side: number): void {
		if (!this.checkIfBallHitsPaddle(state, side)) return;
		console.log('Ball hit paddle');
		this.redirectUpOrDownBasedOnPositionOfPaddleHit(state, side);
	}

	private checkIfBallHitsPaddle(state: i.GameState, side: number): boolean {
		const paddle = this.getPaddleBySide(state, side);

		const offset =
			this.paddleWidth + this.borderOffset + this.ballDiameter / 2;
		const ballIsAbovePaddle = state.ball.y > paddle.y + paddle.height;
		const ballIsBelowPaddle = state.ball.y < paddle.y;
		const ballIsAtLeftLine = state.ball.x <= paddle.x + offset;
		const ballIsAtRightLine = state.ball.x >= this.width - offset;

		if (side === P.One)
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

		if (side === P.One) state.ball.xSpeed = C.BALL_SPEED;
		if (side === P.Two) state.ball.xSpeed = -C.BALL_SPEED;
		if (ballHitsLowerHalf) state.ball.ySpeed = -C.BALL_SPEED;
		if (ballHitsUpperHalf) state.ball.ySpeed = C.BALL_SPEED;
	}

	private getPaddleBySide(state: i.GameState, side: number): i.Paddle {
		if (side === P.One) return state.p1.paddle;
		return state.p2.paddle;
	}

	private handleBounceTopBottom(state: i.GameState): void {
		const ballHitsTopOrBottom =
			state.ball.y < this.ballDiameter / 2 ||
			state.ball.y > this.height - this.ballDiameter;
		if (ballHitsTopOrBottom) state.ball.ySpeed *= -1;
	}

	private boundPaddleToWindow(paddle: i.Paddle) {
		if (paddle.y <= 0) paddle.y = 0;
		if (paddle.y + paddle.height >= this.height)
			paddle.y = this.height - paddle.height;
	}

	private moveBallDuringServe(state: i.GameState) {
		const { p1, p2, ball } = state;
		ball.xSpeed = 0;
		if (p1.isServing) {
			ball.x = p1.paddle.x + this.paddleWidth + this.ballDiameter / 2;
			ball.y = p1.paddle.y + 0.5 * p1.paddle.height;
		}
		if (p2.isServing) {
			ball.x = p2.paddle.x - this.ballDiameter / 2;
			ball.y = p2.paddle.y + 0.5 * p2.paddle.height;
		}
	}
}

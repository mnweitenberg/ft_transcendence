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
		this.paddleWidth = C.PADDLE_WIDTH;
		this.ballDiameter = C.BALL_DIAMETER;
		this.borderOffset = C.BORDER_OFFSET;
	}
	private width: number;
	private height: number;
	private paddleWidth: number;
	private ballDiameter: number;
	private borderOffset: number;

	async runGame(state: i.GameState): Promise<i.GameState> {
		if (!state.match || state.match.isFinished) return;
		this.handleCollisions(state);
		this.handleScore(state);
		this.handleEndOfGame(state);
		return state;
	}

	private handleScore(state: i.GameState) {
		const ballIsBehindLeftPaddle = state.ball.x < this.ballDiameter / 2;
		const ballIsBehindRightPaddle =
			state.ball.x + this.ballDiameter / 2 > this.width;

		if (ballIsBehindLeftPaddle) {
			state.match.p2Score += 1;
			state.p1.isServing = true;
		}

		if (ballIsBehindRightPaddle) {
			state.match.p1Score += 1;
			state.p2.isServing = true;
		}

		if (ballIsBehindLeftPaddle || ballIsBehindRightPaddle) {
			console.log(state.match.p1Score, state.match.p2Score);
			state.ballIsInPlay = false;
		}
	}

	private async handleEndOfGame(state: i.GameState) {
		if (
			state.match.p1Score >= C.MAX_SCORE ||
			state.match.p2Score >= C.MAX_SCORE
		) {
			state.match.isFinished = true;
			const savedMatch = await this.matchRepo.saveMatch(state.match);
			console.log(
				'Successfully saved',
				savedMatch.players[0].username,
				'vs',
				savedMatch.players[1].username,
			);
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

		if (!state.ballIsInPlay) {
			this.moveBallDuringServe(state);
			if (state.p1.isServing)
				setTimeout(() => this.serveBall(state, state.p1), C.TIMEMOUT);
			if (state.p2.isServing)
				setTimeout(() => this.serveBall(state, state.p2), C.TIMEMOUT);
		}
	}

	private moveBall(state: i.GameState) {
		state.ball.x += state.ball.xSpeed;
		state.ball.y += state.ball.ySpeed;
	}

	private handleCollisionPaddle(state: i.GameState, side: number): void {
		if (!this.checkIfBallHitsPaddle(state, side)) return;
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

	serveBall(state: i.GameState, player: i.Player): void {
		if (state.match.isFinished || state.ballIsInPlay || !player.isServing)
			return;
		player.isServing = false;
		state.ballIsInPlay = true;
		console.log('Ball is in play');
	}
}

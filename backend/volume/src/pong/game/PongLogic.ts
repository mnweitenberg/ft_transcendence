import * as C from "./constants";
import * as i from "./interfaces";
import { Side } from "./constants";

import * as CPU from './CPU';
import { initCanvas ,initializeGameState } from './PongInit';

export { initCanvas, initializeGameState, CPU };

export function handleScore(canvas: i.Canvas, state: i.GameState, socket: any) {
	const ballIsBehindLeftWall = state.ball.x < canvas.ballDiameter / 2;
	const ballIsBehindRightWall = state.ball.x + canvas.ballDiameter / 2 > canvas.width;

	if (ballIsBehindLeftWall || ballIsBehindRightWall) {
		state.ball.xSpeed *= -1;
		state.started = false;
	}

	if (ballIsBehindLeftWall) {
		state.gameScore.score.playerTwo += 1;
		state.serveLeft.state = true;
		socket.emit('gameScore', state.gameScore);
		console.log("score", state.gameScore.score)
	}

	if (ballIsBehindRightWall) {
		state.gameScore.score.playerOne += 1;
		state.serveRight.state = true;
		socket.emit('gameScore', state.gameScore);
		console.log("score", state.gameScore.score)
	}

	if (
		state.gameScore.score.playerOne === C.MAX_SCORE ||
		state.gameScore.score.playerTwo === C.MAX_SCORE
	) {
		socket.emit('endOfGame', state.gameScore);
		state.gameScore.score.playerOne = 0;
		state.gameScore.score.playerTwo = 0;
		socket.emit('gameScore', state.gameScore)
	}
}

export function handleCollisions(canvas: i.Canvas, state: i.GameState) {
	// global pause - when not started or serve in progress
	if (state.started === true) {
		state.ball.x += state.ball.xSpeed;
		state.ball.y += state.ball.ySpeed;
	}

	handleCollisionPaddle(canvas, state, Side.left);
	handleCollisionPaddle(canvas, state, Side.right);
	handleBounceTopBottom(canvas, state);

	boundPaddleToWindow(canvas, state.paddleLeft);
	boundPaddleToWindow(canvas, state.paddleRight);

	moveBallDuringServe(canvas, state);
}

function handleCollisionPaddle(canvas: i.Canvas, state: i.GameState, side: number): void {
	let paddle: i.Paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const topOfPaddle = paddle.y + paddle.height;
	const centerOfPaddle = paddle.y + 0.5 * paddle.height;
	const bottomOfPaddle = paddle.y;
	const ballHitsUpperHalf = state.ball.y >= centerOfPaddle && state.ball.y <= topOfPaddle;
	const ballHitsLowerHalf = state.ball.y >= bottomOfPaddle && state.ball.y < centerOfPaddle;

	// if hit with upper half of paddle, redirect up, if lower half, redirect down
	const ballHitsPaddle = checkIfBallHitsPaddle(canvas, state, side);
	if (ballHitsPaddle && side === Side.left) state.ball.xSpeed = C.BALL_SPEED;
	if (ballHitsPaddle && side === Side.right) state.ball.xSpeed = -C.BALL_SPEED;
	if (ballHitsPaddle && ballHitsLowerHalf) state.ball.ySpeed = -C.BALL_SPEED;
	if (ballHitsPaddle && ballHitsUpperHalf) state.ball.ySpeed = C.BALL_SPEED;
}

function checkIfBallHitsPaddle(canvas: i.Canvas, state: i.GameState, side: number): boolean {
	let paddle: i.Paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const offset = canvas.paddleWidth + canvas.borderOffset + canvas.ballDiameter / 2;
	const ballIsAbovePaddle = state.ball.y > paddle.y + paddle.height;
	const ballIsBelowPaddle = state.ball.y < paddle.y;
	const ballIsAtLeftLine = state.ball.x <= paddle.x + offset;
	const ballIsAtRightLine = state.ball.x >= canvas.width - offset;

	if (side === Side.left) return ballIsAtLeftLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
	return ballIsAtRightLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
}

function handleBounceTopBottom(canvas: i.Canvas, state: i.GameState): void {
	const ballHitsTopOrBottom =
		state.ball.y < canvas.ballDiameter / 2 ||
		state.ball.y > canvas.height - canvas.ballDiameter;
	if (ballHitsTopOrBottom) state.ball.ySpeed *= -1;
}

function boundPaddleToWindow(canvas: i.Canvas, paddle: i.Paddle) {
	if (paddle.y <= 0) paddle.y = 0;
	if (paddle.y + paddle.height >= canvas.height)
		paddle.y = canvas.height - paddle.height;
}

function moveBallDuringServe(canvas: i.Canvas, state: i.GameState) {
	if (state.serveLeft.state) {
		state.ball.x = state.paddleLeft.x + canvas.paddleWidth + canvas.ballDiameter / 2;
		state.ball.y = state.paddleLeft.y + 0.5 * state.paddleLeft.height;
	}
	if (state.serveRight.state) {
		state.ball.x = state.paddleRight.x - canvas.ballDiameter / 2;
		state.ball.y = state.paddleRight.y + 0.5 * state.paddleRight.height;
	}
}

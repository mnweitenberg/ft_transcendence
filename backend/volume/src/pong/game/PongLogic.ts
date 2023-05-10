import * as C from "./constants";
import * as i from "./interfaces";
import { Side } from "./constants";

import * as CPU from './CPU';
import { initCanvas ,initializeGameState } from './PongInit';

export { initCanvas, initializeGameState, CPU };

export function handleScore(canvas: i.Canvas, state: i.GameState) {
	const ballIsBehindLeftWall = state.ball.x < canvas.ballDiameter / 2;
	const ballIsBehindRightWall = state.ball.x + canvas.ballDiameter / 2 > canvas.width;

	if (ballIsBehindLeftWall || ballIsBehindRightWall) {
		state.ball.xSpeed *= -1;
		state.started = false;
	}

	if (ballIsBehindLeftWall) {
		// props.incrementScorePlayerTwo();
		state.score.playerTwo += 1;
		state.serveLeft.state = true;
		console.log("score", state.score)
	}

	if (ballIsBehindRightWall) {
		// props.incrementScorePlayerOne();
		state.score.playerOne += 1;
		state.serveRight.state = true;
		console.log("score", state.score)
	}

	// if (
		// state.score.playerOne === C.MAX_SCORE ||
		// state.score.playerTwo === C.MAX_SCORE
	// )
	// 	props.setFinished(true);
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
	let paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const topOfPaddle = paddle.y + canvas.paddleHeight;
	const centerOfPaddle = paddle.y + 0.5 * canvas.paddleHeight;
	const bottomOfPaddle = paddle.y;
	const ballHitsUpperHalf = state.ball.y >= centerOfPaddle && state.ball.y <= topOfPaddle;
	const ballHitsLowerHalf = state.ball.y >= bottomOfPaddle && state.ball.y < centerOfPaddle;

	// if hit with upper half of paddle, redirect up, if lower half, redirect down
	const ballHitsPaddle = checkIfBallHitsPaddle(canvas, state, side);
	if (ballHitsPaddle && side === Side.left) {
		state.ball.xSpeed = state.ball.defaultSpeed;
		// console.log("left paddle hit", paddle.x, paddle.y);
	}
	if (ballHitsPaddle && side === Side.right) {
		state.ball.xSpeed = state.ball.defaultSpeed * -1;
		// console.log("right paddle hit", paddle.x, paddle.y);
	}
	if (ballHitsPaddle && ballHitsLowerHalf) state.ball.ySpeed = state.ball.defaultSpeed * -1;
	if (ballHitsPaddle && ballHitsUpperHalf) state.ball.ySpeed = state.ball.defaultSpeed;
}

function checkIfBallHitsPaddle(canvas: i.Canvas, state: i.GameState, side: number): boolean {
	let paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const offset = canvas.paddleWidth + canvas.borderOffset + canvas.ballDiameter / 2;
	const ballIsAbovePaddle = state.ball.y > paddle.y + canvas.paddleHeight;
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

	if (ballHitsTopOrBottom) {
		state.ball.ySpeed *= -1;
		console.log("bounce", state.ball.x, state.ball.y);
	}
}

function boundPaddleToWindow(canvas: i.Canvas, paddle: i.Paddle) {
	if (paddle.y <= 0) paddle.y = 0;
	if (paddle.y + canvas.paddleHeight >= canvas.height)
		paddle.y = canvas.height - canvas.paddleHeight;
}

function moveBallDuringServe(canvas: i.Canvas, state: i.GameState) {
	if (state.serveLeft.state) {
		state.ball.x = state.paddleLeft.x + canvas.paddleWidth + canvas.ballDiameter / 2;
		state.ball.y = state.paddleLeft.y + 0.5 * canvas.paddleHeight;
	}
	if (state.serveRight.state) {
		state.ball.x = state.paddleRight.x - canvas.ballDiameter / 2;
		state.ball.y = state.paddleRight.y + 0.5 * canvas.paddleHeight;
	}
}

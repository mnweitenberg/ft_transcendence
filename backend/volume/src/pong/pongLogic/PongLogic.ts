import * as C from './constants';
import * as i from './interfaces';
import { Side } from './constants';
import * as CPU from './CPU';

export { CPU };

export function handleScore(canvas: i.Canvas, state: i.GameState, socket: any) {
	if (!state.gameScore) return;

	const ballIsBehindLeftPaddle = state.ball.x < canvas.ballDiameter / 2;
	const ballIsBehindRightPaddle =
		state.ball.x + canvas.ballDiameter / 2 > canvas.width;

	const score = state.gameScore.score;
	if (ballIsBehindLeftPaddle) {
		score.playerTwo += 1;
		state.serveLeft.state = true;
	}

	if (ballIsBehindRightPaddle) {
		score.playerOne += 1;
		state.serveRight.state = true;
	}

	if (ballIsBehindLeftPaddle || ballIsBehindRightPaddle) {
		state.started = false;
		console.log('score', score);
		socket.emit('gameScore', state.gameScore);
	}
}

export function handleCollisions(canvas: i.Canvas, state: i.GameState) {
	boundPaddleToWindow(canvas, state.paddleLeft);
	boundPaddleToWindow(canvas, state.paddleRight);

	if (state.started) {
		moveBall(state);

		handleCollisionPaddle(canvas, state, Side.left);
		handleCollisionPaddle(canvas, state, Side.right);
		handleBounceTopBottom(canvas, state);
	}

	if (!state.started) moveBallDuringServe(canvas, state);
}

function moveBall(state: i.GameState) {
	state.ball.x += state.ball.xSpeed;
	state.ball.y += state.ball.ySpeed;
}

function handleCollisionPaddle(
	canvas: i.Canvas,
	state: i.GameState,
	side: number,
): void {
	if (!checkIfBallHitsPaddle(canvas, state, side)) return;
	redirectUpOrDownBasedOnPositionOfPaddleHit(state, side);
}

function checkIfBallHitsPaddle(
	canvas: i.Canvas,
	state: i.GameState,
	side: number,
): boolean {
	const paddle = getPaddleBySide(state, side);

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

function redirectUpOrDownBasedOnPositionOfPaddleHit(
	state: i.GameState,
	side: number,
) {
	const paddle = getPaddleBySide(state, side);

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

function getPaddleBySide(state: i.GameState, side: number): i.Paddle {
	if (side === Side.left) return state.paddleLeft;
	return state.paddleRight;
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

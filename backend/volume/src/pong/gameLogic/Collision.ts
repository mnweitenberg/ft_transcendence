import * as i from './interfaces';
import { Side } from './constants';

export function handleCollisions(state: i.GameState) {
	if (state.started === false) return;

	state.ball.x += state.ball.xSpeed;
	state.ball.y += state.ball.ySpeed;

	handleCollisionPaddle(Side.left, state);
	handleCollisionPaddle(Side.right, state);
	handleBounceTopBottom(state);
	handleScore(state);
}

function handleCollisionPaddle(side: number, state: i.GameState): void {
	let paddle: i.Paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const topOfPaddle = paddle.y + paddle.height;
	const centerOfPaddle = paddle.y + 0.5 * paddle.height;
	const bottomOfPaddle = paddle.y;
	const ballHitsUpperHalf =
		state.ball.y >= centerOfPaddle && state.ball.y <= topOfPaddle;
	const ballHitsLowerHalf =
		state.ball.y >= bottomOfPaddle && state.ball.y < centerOfPaddle;

	// if hit with upper half of paddle, redirect up, if lower half, redirect down
	const ballHitsPaddle = checkIfBallHitsPaddle(side, state);
	if (ballHitsPaddle && side === Side.left) {
		state.ball.xSpeed = state.ball.defaultSpeed;
		console.log('Left paddle hit');
	}
	if (ballHitsPaddle && side === Side.right) {
		state.ball.xSpeed = state.ball.defaultSpeed * -1;
		console.log('Right paddle hit');
	}
	if (ballHitsPaddle && ballHitsLowerHalf)
		state.ball.ySpeed = state.ball.defaultSpeed * -1;
	if (ballHitsPaddle && ballHitsUpperHalf)
		state.ball.ySpeed = state.ball.defaultSpeed;
}

function checkIfBallHitsPaddle(side: number, state: i.GameState): boolean {
	let paddle: i.Paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const offset = paddle.width + state.borderOffset + state.ball.diameter / 2;
	const ballIsAbovePaddle = state.ball.y > paddle.y + paddle.height;
	const ballIsBelowPaddle = state.ball.y < paddle.y;
	const ballIsAtLeftLine = state.ball.x <= paddle.x + offset;
	const ballIsAtRightLine = state.ball.x >= state.canvasWidth - offset;

	if (side === Side.left)
		return ballIsAtLeftLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
	return ballIsAtRightLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
}

function handleBounceTopBottom(state: i.GameState): void {
	const ballHitsTopOrBottom =
		state.ball.y < state.ball.diameter / 2 ||
		state.ball.y > state.canvasHeight - state.ball.diameter;

	if (ballHitsTopOrBottom) {
		state.ball.ySpeed *= -1;
		console.log('bounce');
	}
}

function handleScore(state: i.GameState) {
	const ballIsBehindLeftWall = state.ball.x < state.ball.diameter / 2;
	const ballIsBehindRightWall =
		state.ball.x + state.ball.diameter / 2 > state.canvasWidth;

	if (ballIsBehindLeftWall || ballIsBehindRightWall) {
		state.ball.xSpeed *= -1;
		state.started = false;
	}

	if (ballIsBehindLeftWall) {
		// TO DO:
		// increment score player two
		console.log('Player two scored!');
		state.score.playerTwo += 1;

		// put ball for left serve
		state.ball.x =
			state.paddleLeft.x +
			state.paddleLeft.width +
			state.ball.diameter / 2;
		state.ball.y = state.paddleLeft.y + 0.5 * state.paddleLeft.height;
		state.serveLeft.state = true;
		state.started = false;
	}

	if (ballIsBehindRightWall) {
		// TO DO:
		// increment score player one
		console.log('Player one scored!');
		state.score.playerOne += 1;

		// put ball for serve
		state.ball.x = state.paddleRight.x - state.ball.diameter / 2;
		state.ball.y = state.paddleRight.y + 0.5 * state.paddleRight.height;
		state.serveRight.state = true;
		state.started = false;
	}
	// TO DO:
	// check if game is finished

	// if (
	// 	props.gameScore.score.playerOne === C.MAX_SCORE ||
	// 	props.gameScore.score.playerTwo === C.MAX_SCORE
	// )
	// 	props.setFinished(true);
}

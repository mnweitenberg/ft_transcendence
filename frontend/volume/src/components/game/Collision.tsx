import * as C from "../../utils/constants";
import * as i from "../../types/Interfaces";
import { Side } from "../../utils/constants";

export function handleCollisions(state: i.GameState, props: i.PongProps) {
	// global pause - when not started or serve in progress
	if (state.started) {
		state.ball.x += state.ball.xSpeed;
		state.ball.y += state.ball.ySpeed;
	}

	handleCollisionPaddle(Side.left, state);
	handleCollisionPaddle(Side.right, state);
	handleBounceTopBottom(state);
	handleScore(state, props);
}

function handleCollisionPaddle(side: number, state: i.GameState): void {
	let paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const topOfPaddle = paddle.y + C.PADDLE_HEIGHT;
	const centerOfPaddle = paddle.y + 0.5 * C.PADDLE_HEIGHT;
	const bottomOfPaddle = paddle.y;
	const ballHitsUpperHalf = state.ball.y >= centerOfPaddle && state.ball.y <= topOfPaddle;
	const ballHitsLowerHalf = state.ball.y >= bottomOfPaddle && state.ball.y < centerOfPaddle;

	// if hit with upper half of paddle, redirect up, if lower half, redirect down
	const ballHitsPaddle = checkIfBallHitsPaddle(side, state);
	if (ballHitsPaddle && side === Side.left) state.ball.xSpeed = C.DEFAULT_BALL_SPEED;
	if (ballHitsPaddle && side === Side.right) state.ball.xSpeed = C.DEFAULT_BALL_SPEED * -1;
	if (ballHitsPaddle && ballHitsLowerHalf) state.ball.ySpeed = C.DEFAULT_BALL_SPEED * -1;
	if (ballHitsPaddle && ballHitsUpperHalf) state.ball.ySpeed = C.DEFAULT_BALL_SPEED;
}

function checkIfBallHitsPaddle(side: number, state: i.GameState): boolean {
	let paddle;
	if (side === Side.left) paddle = state.paddleLeft;
	else paddle = state.paddleRight;

	const offset = C.PADDLE_WIDTH + C.BORDER_OFFSET + C.BALL_DIAMETER / 2;
	const ballIsAbovePaddle = state.ball.y > paddle.y + C.PADDLE_HEIGHT;
	const ballIsBelowPaddle = state.ball.y < paddle.y;
	const ballIsAtLeftLine = state.ball.x <= paddle.x + offset;
	const ballIsAtRightLine = state.ball.x >= state.canvasWidth - offset;

	if (side === Side.left) return ballIsAtLeftLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
	return ballIsAtRightLine && !ballIsAbovePaddle && !ballIsBelowPaddle;
}

function handleBounceTopBottom(state: i.GameState): void {
	const ballHitsTopOrBottom =
		state.ball.y < C.BALL_DIAMETER / 2 || state.ball.y > state.canvasHeight - C.BALL_DIAMETER;

	if (ballHitsTopOrBottom) state.ball.ySpeed *= -1;
}

function handleScore(state: i.GameState, props: i.PongProps) {
	const ballIsBehindLeftWall = state.ball.x < C.BALL_DIAMETER / 2;
	const ballIsBehindRightWall = state.ball.x + C.BALL_DIAMETER / 2 > state.canvasWidth;

	if (ballIsBehindLeftWall || ballIsBehindRightWall) {
		state.ball.xSpeed *= -1;
		state.started = false;
	}

	if (ballIsBehindLeftWall) {
		props.incrementScorePlayerTwo();
		// put ball for left serve
		state.ball.x = state.paddleLeft.x + C.PADDLE_WIDTH + C.BALL_DIAMETER / 2;
		state.ball.y = state.paddleLeft.y + 0.5 * C.PADDLE_HEIGHT;
		state.serveLeft.state = true;
	}

	if (ballIsBehindRightWall) {
		props.incrementScorePlayerOne();
		// put ball for serve
		state.ball.x = state.paddleRight.x - C.BALL_DIAMETER / 2;
		state.ball.y = state.paddleRight.y + 0.5 * C.PADDLE_HEIGHT;
		state.serveRight.state = true;
	}

	if (
		props.gameScore.score.playerOne === C.MAX_SCORE ||
		props.gameScore.score.playerTwo === C.MAX_SCORE
	)
		props.setFinished(true);
}

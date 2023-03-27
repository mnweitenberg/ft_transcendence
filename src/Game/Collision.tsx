import * as CONST from "../Defines/Constants"
import * as i from "../Defines/Interfaces"

export function handleCollisions(state: i.GameState, props: i.PongProps) {
	// global pause - when not started or serve in progress
	if (state.started) {
		state.ball.x += state.ball.xSpeed;
		state.ball.y += state.ball.ySpeed;
	}

	handleCollisionPaddle(CONST.LEFT, state);
	handleCollisionPaddle(CONST.RIGHT, state);
	handleBounceTopBottom(state);
	handleScore(state, props);
}

function handleCollisionPaddle(side: number, state: i.GameState) : void {

	let ballHitsPaddle;
	let paddle;
	if (side === CONST.LEFT)
		paddle = state.paddleLeft; 
	else
		paddle = state.paddleRight; 

	if (side === CONST.LEFT)
		ballHitsPaddle = state.ball.x <= paddle.x + CONST.PADDLE_WIDTH + CONST.BORDER_OFFSET + (CONST.BALL_DIAMETER / 2)
			&& state.ball.y < paddle.y + CONST.PADDLE_HEIGHT
			&& state.ball.y >= paddle.y
	else
		ballHitsPaddle = state.ball.x >= state.canvasWidth - CONST.BORDER_OFFSET - CONST.PADDLE_WIDTH - (CONST.BALL_DIAMETER / 2)
			&& state.ball.y <= paddle.y + CONST.PADDLE_HEIGHT
			&& state.ball.y >= paddle.y

	let ballHitsUpperHalf = state.ball.y >= paddle.y
		&& state.ball.y < (paddle.y + (0.5 * CONST.PADDLE_HEIGHT));

	let ballHitsLowerHalf = state.ball.y > (paddle.y + (0.5 * CONST.PADDLE_HEIGHT))
		&& state.ball.y <= (paddle.y + CONST.PADDLE_HEIGHT);

	// Detect collision with paddle
	// if hit with upper half of paddle, redirect up, if lower half, redirect down
	if (ballHitsPaddle && side === CONST.LEFT) {
		if (ballHitsUpperHalf) {
			state.ball.xSpeed = Math.abs(state.ball.xSpeed);
			state.ball.ySpeed = Math.abs(state.ball.ySpeed) * -1;
		}
		if (ballHitsLowerHalf) {
			state.ball.xSpeed = Math.abs(state.ball.xSpeed);
			state.ball.ySpeed = Math.abs(state.ball.ySpeed);
		}
	}
	if (ballHitsPaddle && side === CONST.RIGHT) {
		if (ballHitsUpperHalf) {
			state.ball.xSpeed = Math.abs(state.ball.xSpeed) * -1;
			state.ball.ySpeed = Math.abs(state.ball.ySpeed) * -1;
		}
		if (ballHitsLowerHalf) {
			state.ball.xSpeed = Math.abs(state.ball.xSpeed) * -1;
			state.ball.ySpeed = Math.abs(state.ball.ySpeed);
		}
	}
}

function handleBounceTopBottom(state: i.GameState) : void {
	let ballHitsTopOrBottom = state.ball.y < CONST.BALL_DIAMETER / 2
		|| state.ball.y > state.canvasHeight - CONST.BALL_DIAMETER;

	if (ballHitsTopOrBottom)
		state.ball.ySpeed *= -1;
}

function handleScore(state: i.GameState, props: i.PongProps) {
	let ballIsBehindLeftWall = state.ball.x < CONST.BALL_DIAMETER / 2;
	let ballIsBehindRightWall = state.ball.x + CONST.BALL_DIAMETER / 2 > state.canvasWidth;

	if (ballIsBehindLeftWall || ballIsBehindRightWall) {
		state.ball.xSpeed *= -1;
		state.started = false;
	}

	if (ballIsBehindLeftWall) {
		props.incrementScorePlayerTwo();
		// put ball for left serve
		state.ball.x = state.paddleLeft.x + CONST.PADDLE_WIDTH + CONST.BALL_DIAMETER / 2;
		state.ball.y = state.paddleLeft.y + (0.5 * CONST.PADDLE_HEIGHT);
		state.serveLeft.state = true;
	}

	// if (false) {
	if (ballIsBehindRightWall) {
		props.incrementScorePlayerOne();
		// put ball for serve
		state.ball.x = state.paddleRight.x - CONST.BALL_DIAMETER / 2;
		state.ball.y = state.paddleRight.y + (0.5 * CONST.PADDLE_HEIGHT);
		state.serveRight.state = true;
	}

	if (state.score.score.playerOne === CONST.MAX_SCORE
		|| state.score.score.playerTwo === CONST.MAX_SCORE)
		props.setFinished(true);
}

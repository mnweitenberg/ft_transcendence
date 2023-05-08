import * as i from './interfaces';

export function handleMouseMove(input: number, state: i.GameState) {
	state.paddleRight.y = input;
	boundToWindow(state, state.paddleLeft, state.paddleRight);
	moveBallDuringLeftServe(
		state.ball,
		state.paddleLeft,
		state.serveLeft.state,
	);
	moveBallDuringRightServe(
		state.ball,
		state.paddleRight,
		state.serveRight.state,
	);
	// console.log(state.paddleRight.y);
}

function boundToWindow(
	gameState: i.GameState,
	paddleLeft: i.Paddle,
	paddleRight: i.Paddle,
) {
	if (paddleLeft.y <= 0) paddleLeft.y = 0;
	if (paddleLeft.y + paddleLeft.height >= gameState.canvasHeight)
		paddleLeft.y = gameState.canvasHeight - paddleLeft.height;
	if (paddleRight.y <= 0) paddleRight.y = 0;
	if (paddleRight.y + paddleRight.height >= gameState.canvasHeight)
		paddleRight.y = gameState.canvasHeight - paddleRight.height;
}

function moveBallDuringLeftServe(
	ball: i.Ball,
	paddle: i.Paddle,
	serve: boolean,
) {
	if (serve) {
		ball.x = paddle.x + paddle.width + ball.diameter / 2;
		ball.y = paddle.y + 0.5 * paddle.height;
	}
}

function moveBallDuringRightServe(
	ball: i.Ball,
	paddle: i.Paddle,
	serve: boolean,
) {
	if (serve) {
		ball.x = paddle.x - ball.diameter / 2;
		ball.y = paddle.y + 0.5 * paddle.height;
	}
}

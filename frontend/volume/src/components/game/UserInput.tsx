import * as C from "../../utils/constants";
import * as i from "../../types/Interfaces";
import p5Types from "p5";

function moveBallDuringLeftServe(ball: i.Ball, paddle: i.Paddle, serve: boolean) {
	if (serve) {
		ball.x = paddle.x + C.PADDLE_WIDTH + C.BALL_DIAMETER / 2;
		ball.y = paddle.y + 0.5 * C.PADDLE_HEIGHT;
	}
}

function moveBallDuringRightServe(ball: i.Ball, paddle: i.Paddle, serve: boolean) {
	if (serve) {
		ball.x = paddle.x - C.BALL_DIAMETER / 2;
		ball.y = paddle.y + 0.5 * C.PADDLE_HEIGHT;
	}
}

function boundToWindow(gameState: i.GameState, paddleLeft: i.Paddle, paddleRight: i.Paddle) {
	if (paddleLeft.y <= 0) paddleLeft.y = 0;
	if (paddleLeft.y + C.PADDLE_HEIGHT >= gameState.canvasHeight)
		paddleLeft.y = gameState.canvasHeight - C.PADDLE_HEIGHT;
	if (paddleRight.y <= 0) paddleRight.y = 0;
	if (paddleRight.y + C.PADDLE_HEIGHT >= gameState.canvasHeight)
		paddleRight.y = gameState.canvasHeight - C.PADDLE_HEIGHT;
}

//p5 event on key press
export function handleMouseInput(p5: p5Types, state: i.GameState) {
	state.paddleRight.y = p5.mouseY;
	boundToWindow(state, state.paddleLeft, state.paddleRight);
	moveBallDuringLeftServe(state.ball, state.paddleLeft, state.serveLeft.state);
	moveBallDuringRightServe(state.ball, state.paddleRight, state.serveRight.state);
}

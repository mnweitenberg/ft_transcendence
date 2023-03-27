import * as CONST from "../Defines/Constants"
import * as i from "../Defines/Interfaces"

function moveBallDuringLeftServe(ball: i.Ball, paddle: i.Paddle, serve: boolean) {
	if (serve) {
		ball.x = paddle.x + CONST.PADDLE_WIDTH + CONST.BALL_DIAMETER/2;
		ball.y = paddle.y + (0.5 * CONST.PADDLE_HEIGHT);
	}
}
function moveBallDuringRightServe(ball: i.Ball, paddle: i.Paddle, serve: boolean) {
	if (serve) {
		ball.x = paddle.x - CONST.BALL_DIAMETER/2;
		ball.y = paddle.y + (0.5 * CONST.PADDLE_HEIGHT);
	}
}

function boundToWindow(gameState: i.GameState, paddleLeft: i.Paddle, paddleRight: i.Paddle) {
	if (paddleLeft.y <= 0)
		paddleLeft.y = 0;
	if (paddleLeft.y + CONST.PADDLE_HEIGHT >= gameState.canvasHeight )
		paddleLeft.y = gameState.canvasHeight - CONST.PADDLE_HEIGHT;
	if (paddleRight.y <= 0)
		paddleRight.y = 0;
	if (paddleRight.y + CONST.PADDLE_HEIGHT >= gameState.canvasHeight )
		paddleRight.y = gameState.canvasHeight - CONST.PADDLE_HEIGHT;
}

//p5 event on key press
export function handleMouseInput (mouseY:number, state: i.GameState) {

	state.paddleRight.y = mouseY;
	boundToWindow(state, state.paddleLeft, state.paddleRight);
	moveBallDuringLeftServe(state.ball, state.paddleLeft, state.serveLeft.state);
	moveBallDuringRightServe(state.ball, state.paddleRight, state.serveRight.state);
}

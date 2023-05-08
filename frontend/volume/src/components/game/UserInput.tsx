import * as i from "../../types/Interfaces";
import p5Types from "p5";
import SocketSingleton from "../../utils/socketSingleton";

export function handleMouseInput(p5: p5Types, state: i.GameState) {
	const socketSingleton = SocketSingleton.getInstance();
	const sendMouseY = (mouseY: number) => {
		socketSingleton.socket.emit("sendMouseY", { mouseY });
	};

	const sendMouseClick = (mouseClick: boolean) => {
		socketSingleton.socket.emit("mouseClick", { mouseClick });
	};

	state.paddleRight.y = p5.mouseY;
	boundToWindow(state, state.paddleLeft, state.paddleRight);
	moveBallDuringLeftServe(state.ball, state.paddleLeft, state.serveLeft.state);
	moveBallDuringRightServe(state.ball, state.paddleRight, state.serveRight.state);

	// Call the sendMouseY function with the p5.mouseY value
	let relativeMouseY = p5.mouseY / state.canvasHeight;
	if (relativeMouseY < 0) relativeMouseY = 0;
	if (relativeMouseY > 1) relativeMouseY = 1;
	sendMouseY(relativeMouseY);

	// Call the sendMouseClick function with the p5.mouseIsPressed value
	sendMouseClick(p5.mouseIsPressed);
}

function moveBallDuringLeftServe(ball: i.Ball, paddle: i.Paddle, serve: boolean) {
	if (serve) {
		ball.x = paddle.x + paddle.width + ball.diameter / 2;
		ball.y = paddle.y + 0.5 * paddle.height;
	}
}

function moveBallDuringRightServe(ball: i.Ball, paddle: i.Paddle, serve: boolean) {
	if (serve) {
		ball.x = paddle.x - ball.diameter / 2;
		ball.y = paddle.y + 0.5 * paddle.height;
	}
}

function boundToWindow(gameState: i.GameState, paddleLeft: i.Paddle, paddleRight: i.Paddle) {
	if (paddleLeft.y <= 0) paddleLeft.y = 0;
	if (paddleLeft.y + paddleLeft.height >= gameState.canvasHeight)
		paddleLeft.y = gameState.canvasHeight - paddleLeft.height;
	if (paddleRight.y <= 0) paddleRight.y = 0;
	if (paddleRight.y + paddleRight.height >= gameState.canvasHeight)
		paddleRight.y = gameState.canvasHeight - paddleRight.height;
}

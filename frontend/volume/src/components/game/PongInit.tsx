import * as i from "../../types/Interfaces";

export function initCanvas(width: number | undefined): i.Canvas {
	if (!width) width = 800;
	const height = width / 2;
	const paddleHeight = height / 5;
	const paddleWidth = paddleHeight / 10;
	const borderOffset = paddleWidth / 2;
	const ballDiameter = paddleWidth * 2;
	const canvas: i.Canvas = {
		height,
		width,
		paddleHeight,
		paddleWidth,
		ballDiameter,
		borderOffset,
	};
	return canvas;
}

export function initializeGameState(canvas: i.Canvas): i.GameState {
	const paddleLeft: i.Paddle = {
		x: canvas.borderOffset,
		y: canvas.height / 2,
		height: canvas.paddleHeight,
	};

	const paddleRight: i.Paddle = {
		x: canvas.width - canvas.borderOffset - canvas.paddleWidth,
		y: canvas.height / 2,
		height: canvas.paddleHeight,
	};

	const serveLeft: i.ServeState = {
		state: false,
		x: paddleLeft.x + canvas.paddleWidth + canvas.ballDiameter / 2,
		y: paddleLeft.y + 0.5 * canvas.paddleHeight,
	};

	const serveRight: i.ServeState = {
		state: false,
		x: paddleRight.x - canvas.ballDiameter / 2,
		y: paddleRight.y + 0.5 * canvas.paddleHeight,
	};

	const ball: i.Ball = {
		x: serveRight.x,
		y: paddleRight.y + canvas.paddleHeight / 2,
	};

	const state: i.GameState = {
		started: false,
		paddleLeft,
		paddleRight,
		serveLeft,
		serveRight,
		ball,
	};

	return state;
}

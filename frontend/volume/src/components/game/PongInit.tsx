import * as i from "../../types/Interfaces";

export function initCanvas(width = 800): i.Canvas {
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
	const { borderOffset, paddleHeight, paddleWidth, ballDiameter, height, width } = canvas;

	const paddleLeft: i.Paddle = {
		x: borderOffset,
		y: height / 2,
		height: paddleHeight,
	};

	const paddleRight: i.Paddle = {
		x: width - borderOffset - paddleWidth,
		y: height / 2,
		height: paddleHeight,
	};

	const serveLeft: i.ServeState = {
		state: false,
		x: paddleLeft.x + paddleWidth + ballDiameter / 2,
		y: paddleLeft.y + 0.5 * paddleHeight,
	};

	const serveRight: i.ServeState = {
		state: false,
		x: paddleRight.x - ballDiameter / 2,
		y: paddleRight.y + 0.5 * paddleHeight,
	};

	const ball: i.Ball = {
		x: serveRight.x,
		y: paddleRight.y + paddleHeight / 2,
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

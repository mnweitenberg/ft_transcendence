import * as i from "../../types/Interfaces";

export function initCanvas(width = 800): i.Canvas {
	const height = width / 2;
	const paddleHeight = height / 5;
	const paddleWidth = paddleHeight / 10;
	const borderOffset = paddleWidth / 2;
	const ballSpeed = paddleWidth / 20;
	const ballDiameter = paddleWidth * 2;
	const canvas: i.Canvas = {
		height,
		width,
		paddleHeight,
		paddleWidth,
		ballSpeed,
		borderOffset,
		ballDiameter,
	};
	return canvas;
}

export function initializeGameState(canvas: i.Canvas): i.GameState {
	const { borderOffset, paddleHeight, paddleWidth, ballSpeed, height, width } = canvas;

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

	const p1: i.Player = {
		paddle: paddleLeft,
		isServing: false,
	};

	const p2: i.Player = {
		paddle: paddleRight,
		isServing: true,
	};

	const ball: i.Ball = {
		x: paddleRight.x,
		y: paddleRight.y + paddleHeight / 2,
		xSpeed: -ballSpeed,
		ySpeed: ballSpeed,
	};

	const state: i.GameState = {
		ballIsInPlay: false,
		p1,
		p2,
		ball,
	};

	return state;
}

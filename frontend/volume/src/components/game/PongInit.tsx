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
	const ballSpeed = canvas.ballDiameter;

	const paddleLeft: i.Paddle = {
		x: canvas.borderOffset,
		y: canvas.height / 2,
	};

	const paddleRight: i.Paddle = {
		x: canvas.width - canvas.borderOffset - canvas.paddleWidth,
		y: canvas.height / 2,
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
		xSpeed: ballSpeed,
		ySpeed: ballSpeed,
		defaultSpeed: ballSpeed,
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

// function resizeCanvasOnBrowserResize(state: i.GameState, gameScore: i.GameScore) {
// 	window.addEventListener("resize", () => {
// 		state = initializeGameState(gameScore, document.getElementById("game"));
// 	});
// }

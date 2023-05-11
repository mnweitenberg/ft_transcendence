import * as C from "./constants";
import * as i from "./interfaces";

export function initCanvas(): i.Canvas {
	const width = 2;
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
		state: true,
		x: paddleRight.x - canvas.ballDiameter / 2,
		y: paddleRight.y + 0.5 * canvas.paddleHeight,
	};

	const ball: i.Ball = {
		x: serveRight.x,
		y: paddleRight.y + canvas.paddleHeight / 2,
		xSpeed: -C.BALL_SPEED,
		ySpeed: C.BALL_SPEED,
	};

	const gameScore: i.GameScore = {
		id: 0,
		playerOne: {
			id: 'One',
			name: "One",
			avatar: "",
			stats: {
				ranking: 0,
				wins: 0,
				losses: 0,
				score: 0,
			},
			status: "online",
			friends: [],
		},
		playerTwo: {
			id: 'Two',
			name: "Two",
			avatar: "",
			stats: {
				ranking: 0,
				wins: 0,
				losses: 0,
				score: 0,
			},
			status: "online",
			friends: [],
		},
		score: {
			playerOne: 0,
			playerTwo: 0,
		},
	}

	const state: i.GameState = {
		started: false,
		paddleLeft,
		paddleRight,
		serveLeft,
		serveRight,
		ball,
		gameScore,
	};

	return state;
}

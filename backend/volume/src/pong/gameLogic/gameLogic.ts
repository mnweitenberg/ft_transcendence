import * as CPU from './CPU';
import * as i from './interfaces';
import { handleCollisions } from './Collision';
import { handleMouseMove } from './UserInput';

function initializeGameState(): i.GameState {
	const canvasWidth = 2;
	const canvasHeight = canvasWidth / 2;
	const paddleHeight = canvasHeight / 5;
	const paddleWidth = paddleHeight / 10;
	const ballDiameter = paddleWidth * 2;
	const ballSpeed = ballDiameter;
	const borderOffset = paddleWidth / 2;

	const paddleLeft: i.Paddle = {
		x: borderOffset,
		y: canvasHeight / 2,
		height: paddleHeight,
		width: paddleWidth,
	};

	const paddleRight: i.Paddle = {
		x: canvasWidth - borderOffset - paddleWidth,
		y: canvasHeight / 2,
		height: paddleHeight,
		width: paddleWidth,
	};

	const serveLeft: i.ServeState = {
		state: false,
		x: paddleLeft.x + paddleWidth + ballDiameter / 2,
		y: paddleLeft.y + 0.5 * paddleHeight,
	};

	const serveRight: i.ServeState = {
		state: true,
		x: paddleRight.x - ballDiameter / 2,
		y: paddleRight.y + 0.5 * paddleHeight,
	};

	const ball: i.Ball = {
		x: serveRight.x,
		y: paddleRight.y + paddleHeight / 2,
		xSpeed: -ballSpeed,
		ySpeed: ballSpeed,
		defaultSpeed: ballSpeed,
		diameter: ballDiameter,
	};

	const score: i.Score = {
		playerOne: 0,
		playerTwo: 0,
	};

	const state: i.GameState = {
		started: false,
		canvasHeight: canvasHeight,
		canvasWidth: canvasWidth,
		paddleLeft,
		paddleRight,
		serveLeft,
		serveRight,
		ball,
		borderOffset: borderOffset,
		score: score,
	};

	return state;
}

export { initializeGameState, CPU, handleCollisions, handleMouseMove };

import * as i from './interfaces';
import * as C from './constants';

export class PongService {
	initializeGameState(): i.GameState {
		const paddleLeft: i.Paddle = {
			x: C.BORDER_OFFSET,
			y: C.HEIGHT / 2 + C.PADDLE_HEIGHT / 2,
			height: C.PADDLE_HEIGHT,
		};

		const paddleRight: i.Paddle = {
			x: C.WIDTH - C.BORDER_OFFSET - C.PADDLE_WIDTH,
			y: C.HEIGHT / 2,
			height: C.PADDLE_HEIGHT,
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
			y: paddleRight.y + C.PADDLE_HEIGHT / 2,
			xSpeed: -C.BALL_SPEED,
			ySpeed: C.BALL_SPEED,
		};

		const state: i.GameState = {
			gameIsRunning: false,
			ballIsInPlay: false,
			p1,
			p2,
			ball,
		};

		return state;
	}
}

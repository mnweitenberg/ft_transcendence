import { Injectable } from '@nestjs/common';
import * as i from './interfaces';
import * as C from './constants';
import { GameLogicService } from './gameLogic.service';

@Injectable()
export class PongService {
	constructor(private readonly gameLogicService: GameLogicService) {}

	private state = this.initializeGameState();

	async startMatch(match): Promise<i.GameState> {
		this.state.match = match;
		this.gameLogicService.runGame(this.state);
		return this.state;
	}

	initializeGameState(): i.GameState {
		const paddleLeft: i.Paddle = {
			x: C.BORDER_OFFSET,
			y: C.HEIGHT / 2,
			height: C.PADDLE_HEIGHT,
		};

		const paddleRight: i.Paddle = {
			x: C.WIDTH - C.BORDER_OFFSET - C.PADDLE_WIDTH,
			y: C.HEIGHT / 2,
			height: C.PADDLE_HEIGHT,
		};

		const p1: i.Player = {
			id: '1',
			paddle: paddleLeft,
			isServing: false,
		};

		const p2: i.Player = {
			id: '2',
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
			isStarted: false,
			ballIsInPlay: false,
			p1,
			p2,
			ball,
		};

		return state;
	}
}

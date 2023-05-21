import { Injectable } from '@nestjs/common';
import * as i from './interfaces';
import * as C from './constants';
import { GameLogicService } from './gameLogic.service';

@Injectable()
export class PongService {
	constructor(private readonly gameService: GameLogicService) {}

	enlargePaddle(canvas: i.Canvas, state: i.GameState): void {
		if (state.paddleRight.height < canvas.height) {
			state.paddleRight.height *= 1.2;
		}
	}

	reducePaddle(canvas: i.Canvas, state: i.GameState): void {
		if (state.paddleRight.height > canvas.paddleHeight) {
			state.paddleRight.height *= 0.8;
		}
	}

	handleMouseYUpdate(mouseY: number, state: i.GameState): void {
		state.paddleRight.y = mouseY;
	}

	handleMouseClick(socket: any, mouseClick: boolean, state: i.GameState, canvas: i.Canvas): void {
		if (mouseClick && !state.isStarted) {
			state.isStarted = true;
			socket.emit('setScorePlayerOne', 0);
			socket.emit('setScorePlayerTwo', 0);
			this.gameService.runGame(socket, state, canvas);
		}
		else if (mouseClick && !state.ballIsInPlay) {
			this.gameService.serveBall(socket, state);
		}
	}

	initCanvas(): i.Canvas {
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
	
	async initializeGameState(canvas: i.Canvas): Promise<i.GameState> {
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
		// this.queueService.fillDbUser();
		// await this.queueService.createMatches();

		const state: i.GameState = {
			isStarted: false,
			ballIsInPlay: false,
			paddleLeft,
			paddleRight,
			serveLeft,
			serveRight,
			ball,
			// match: await this.matchRepo.initNewMatch(),
		};
	
		return state;
	}	
}

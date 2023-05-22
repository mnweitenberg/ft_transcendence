import { Injectable } from '@nestjs/common';
import * as i from './interfaces';
import * as C from './constants';
import { GameLogicService } from './gameLogic.service';
// import { SocketModule } from './socket.module';
import { Server } from 'socket.io';

@Injectable()
export class PongService {
	constructor(
		private readonly gameLogicService: GameLogicService, // private readonly socketModule: SocketModule,
	) {}

	private canvas = this.initCanvas();
	private state = this.initializeGameState(this.canvas);
	private socket;

	async startMatch(match): Promise<void> {
		// const state = this.initializeGameState(this.canvas);
		this.state.match = match;
		// console.log(this.state.match);
		this.gameLogicService.runGame(null, this.state, this.canvas);
		// this.setupSocketServer(state);
	}

	// private setupSocketServer(state: i.GameState): void {
	// 	const io = new Server(4244, { cors: { origin: '*' } });
	// 	io.on('connection', (socket) => {
	// 		console.log('Client connected:', socket.id);
	// 		if (!this.socket) this.socket = socket;
	// 		this.handleSocketEvents();
	// 		this.gameLogicService.runGame(this.socket, state, this.canvas);
	// 		this.handleSocketDisconnection(socket);
	// 	});
	// }

	handleSocketDisconnection(socket): void {
		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id);
		});
	}

	private handleSocketEvents(): void {
		if (!this.socket) return;

		this.socket.on('sendMouseY', (data) => {
			this.handleMouseYUpdate(data.mouseY);
		});

		this.socket.on('mouseClick', (data) => {
			this.handleMouseClick(this.socket, data.mouseClick);
		});

		this.socket.on('enlargePaddle', () => {
			this.enlargePaddle();
		});

		this.socket.on('reducePaddle', () => {
			this.reducePaddle();
		});
	}

	enlargePaddle(): void {
		if (this.state.paddleRight.height < this.canvas.height) {
			this.state.paddleRight.height *= 1.2;
		}
	}

	reducePaddle(): void {
		if (this.state.paddleRight.height > this.canvas.paddleHeight) {
			this.state.paddleRight.height *= 0.8;
		}
	}

	handleMouseYUpdate(mouseY: number): void {
		this.state.paddleRight.y = mouseY;
	}

	handleMouseClick(socket: any, mouseClick: boolean): void {
		if (mouseClick && !this.state.isStarted) {
			this.state.isStarted = true;
			socket.emit('playerScored', [0, 0]);
			// this.gameLogicService.runGame(socket, this.state, this.canvas);
		} else if (mouseClick && !this.state.ballIsInPlay) {
			this.gameLogicService.serveBall(this.state);
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

	initializeGameState(canvas: i.Canvas): i.GameState {
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
			isServing: false,
			x: paddleLeft.x + canvas.paddleWidth + canvas.ballDiameter / 2,
			y: paddleLeft.y + 0.5 * canvas.paddleHeight,
		};

		const serveRight: i.ServeState = {
			isServing: true,
			x: paddleRight.x - canvas.ballDiameter / 2,
			y: paddleRight.y + 0.5 * canvas.paddleHeight,
		};

		const ball: i.Ball = {
			x: serveRight.x,
			y: paddleRight.y + canvas.paddleHeight / 2,
			xSpeed: -C.BALL_SPEED,
			ySpeed: C.BALL_SPEED,
		};

		const state: i.GameState = {
			isStarted: false,
			ballIsInPlay: false,
			paddleLeft,
			paddleRight,
			serveLeft,
			serveRight,
			ball,
			// match: match,
		};

		return state;
	}
}

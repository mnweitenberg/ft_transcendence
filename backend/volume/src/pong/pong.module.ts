import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { Server } from 'socket.io';
import { initCanvas, initializeGameState, handleScore, CPU, handleCollisions } from './game/PongLogic';
import * as i from './game/interfaces';

@Module({
	providers: [PongService],
})
export class PongModule {
	private state: i.GameState;
	private canvas: i.Canvas;
	private gameInterval: NodeJS.Timeout | null = null;
	constructor(private readonly pongService: PongService) {
		this.setupSocketServer();
		this.canvas = initCanvas();
		this.state = initializeGameState(this.canvas);
	}

	private setupSocketServer(): void {
		const io = new Server(4243, { cors: { origin: '*' } });

		io.on('connection', (socket) => {
			console.log('Client connected:', socket.id);

			socket.on('sendMouseY', (data) => {
				this.pongService.handleMouseYUpdate(data.mouseY, this.state);
			});

			socket.on('mouseClick', (data) => {
				this.pongService.handleMouseClick(data.mouseClick, this.state);
			});

			if (this.gameInterval) clearInterval(this.gameInterval);

			socket.emit('gameState', this.state);

			this.gameInterval = setInterval(() => {
				CPU.Action(this.state);
				handleCollisions(this.canvas, this.state);
				handleScore(this.canvas, this.state);
				socket.emit('gameState', this.state);
			}, 1000 / 24);

			socket.on('disconnect', () => {
				console.log('Client disconnected:', socket.id);
				this.state.score.playerOne = 0;
				this.state.score.playerTwo = 0;
				this.state.started = false;
			});
		});
	}
}


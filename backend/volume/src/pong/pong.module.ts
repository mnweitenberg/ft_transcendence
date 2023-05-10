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
		this.canvas = initCanvas();
		this.state = initializeGameState(this.canvas);
		this.setupSocketServer();
	}

	private setupSocketServer(): void {
		const io = new Server(4243, { cors: { origin: '*' } });

		io.on('connection', (socket) => {
			console.log('Client connected:', socket.id);
	  
			this.handleSocketEvents(socket);
			this.resetGameInterval(socket);
			this.handleSocketDisconnection(socket);
		});
	}

	private handleSocketEvents(socket): void {
		socket.on('sendMouseY', (data) => {
			this.pongService.handleMouseYUpdate(data.mouseY, this.state);
		});
	
		socket.on('mouseClick', (data) => {
			this.pongService.handleMouseClick(data.mouseClick, this.state);
		});
	
		socket.on('enlargePaddle', () => {
			this.pongService.enlargePaddle(this.canvas, this.state);
		});
	
		socket.on('reducePaddle', () => {
			this.pongService.reducePaddle(this.canvas, this.state);
		});
	}
		
	private resetGameInterval(socket): void {
		if (this.gameInterval) clearInterval(this.gameInterval);
	
		this.gameInterval = setInterval(() => {
			CPU.Action(this.state);
			handleCollisions(this.canvas, this.state);
			handleScore(this.canvas, this.state, socket);
			socket.emit('gameState', this.state);
		}, 1000 / 24);
	}

	private handleSocketDisconnection(socket): void {
		socket.on('disconnect', () => {
		  	console.log('Client disconnected:', socket.id);
		  	this.state.gameScore.score.playerOne = 0;
			this.state.gameScore.score.playerTwo = 0;
			this.state.started = false;
		});
	}		
}

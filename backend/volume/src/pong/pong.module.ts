import { Module } from '@nestjs/common';
// import { PongResolver } from './pong.resolver';
import { PongService } from './pong.service';
import { Server } from 'socket.io';
import {
	handleCollisions,
	CPU,
	initializeGameState,
} from './gameLogic/gameLogic';
import * as i from './gameLogic/interfaces';

@Module({
	providers: [PongService],
})
export class PongModule {
	private state: i.GameState;
	constructor(private readonly pongService: PongService) {
		this.setupSocketServer();
		this.state = initializeGameState();
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

			socket.on('disconnect', () => {
				console.log('Client disconnected:', socket.id);
				this.state.started = false;
			});
		});
	}
}

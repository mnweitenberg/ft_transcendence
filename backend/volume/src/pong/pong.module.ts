import { Module } from '@nestjs/common';
// import { PongResolver } from './pong.resolver';
import { PongService } from './pong.service';
import { Server } from 'socket.io';

@Module({
	providers: [PongService],
})
export class PongModule {
	constructor(private readonly pongService: PongService) {
		this.setupSocketServer();
	}

	private setupSocketServer(): void {
		const io = new Server(4243, { cors: { origin: '*' } });

		io.on('connection', (socket) => {
			console.log('Client connected:', socket.id);

			socket.on('sendMouseY', (data) => {
				this.pongService.handleMouseYUpdate(data.mouseY);
			});

			socket.on('disconnect', () => {
				console.log('Client disconnected:', socket.id);
			});
		});
	}
}

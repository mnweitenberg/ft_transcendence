import { Module, OnModuleInit } from '@nestjs/common';
import { PongService } from './pong.service';
import { Server } from 'socket.io';
import * as i from './interfaces';
import { Match } from './match/entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRepository } from './match/match.repository';
import { QueueService } from './queue/queue.service';
import { QueueModule } from './queue/queue.module';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Ranking } from './ranking/entities/ranking.entity';
import { GameService } from './game.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Match, User, Ranking]), 
		QueueModule,
		UserModule,
	],
	providers: [PongService, MatchRepository, QueueService, GameService],
})
export class PongModule implements OnModuleInit {
    constructor(
        private readonly pongService: PongService,
        private readonly gameService: GameService,
		private readonly matchRepo: MatchRepository,
		private readonly queueService: QueueService,
    ) { }

	private state: i.GameState;
	private canvas: i.Canvas;

	async onModuleInit() {
		// TODO handle empty Queue
		// this.queueService.fillDbUser();
		this.queueService.createMatches();
        this.canvas = this.pongService.initCanvas();
        this.state = await this.pongService.initializeGameState(this.canvas);
        this.setupSocketServer();
    }

	private setupSocketServer(): void {
		const io = new Server(4243, { cors: { origin: '*' } });

		io.on('connection', (socket) => {
			console.log('Client connected:', socket.id);

			this.handleSocketEvents(socket);
			this.handleSocketDisconnection(socket);
		});
	}

	private handleSocketEvents(socket): void {
		socket.on('sendMouseY', (data) => {
			this.pongService.handleMouseYUpdate(data.mouseY, this.state);
		});

		socket.on('mouseClick', (data) => {
			this.pongService.handleMouseClick(socket, data.mouseClick, this.state, this.canvas);
		});

		socket.on('enlargePaddle', () => {
			this.pongService.enlargePaddle(this.canvas, this.state);
		});

		socket.on('reducePaddle', () => {
			this.pongService.reducePaddle(this.canvas, this.state);
		});
	}

	private handleSocketDisconnection(socket): void {
		socket.on('disconnect', () => {
			this.state.isStarted = false;
			this.state.ballIsInPlay = false;
			console.log('Client disconnected:', socket.id);
		});
	}
}

import { Module, OnModuleInit } from '@nestjs/common';
import { PongService } from './pong.service';
import { Server } from 'socket.io';
import { handleScore, CPU, handleCollisions } from './pongLogic/PongLogic';
import * as i from './pongLogic/interfaces';
import * as C from './pongLogic/constants';
import { Match } from './match/entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRepository } from './match/Match.repository';
import { QueueService } from './queue/queue.service';
import { QueueModule } from './queue/queue.module';
import { UserModule } from 'src/user/user.module';
// import { RankingModule } from './ranking/ranking.module';
// import { UserRepository } from '../user/user.repository';
// import { RankingRepository } from './ranking/ranking.repository';
import { User } from 'src/user/entities/user.entity';
import { Ranking } from './ranking/entities/ranking.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Match, User, Ranking]), 
		QueueModule,
		UserModule,
		// RankingModule,
	],
	providers: [PongService, MatchRepository, QueueService],
})
export class PongModule implements OnModuleInit {
	private state: i.GameState;
	private canvas: i.Canvas;
	private gameInterval: NodeJS.Timeout | null = null;

	async onModuleInit() {
        this.canvas = this.pongService.initCanvas();
        this.state = await this.pongService.initializeGameState(this.canvas);
        this.setupSocketServer();
		// TODO handle empty Queue
		// this.queueService.fillDbUser();
		this.queueService.createMatches();
    }

    constructor(
        private readonly pongService: PongService,
        private readonly matchRepo: MatchRepository,
		private readonly queueService: QueueService,
    ) { }

	private setupSocketServer(): void {
		const io = new Server(4243, { cors: { origin: '*' } });

		io.on('connection', (socket) => {
			console.log('Client connected:', socket.id);

			this.handleSocketEvents(socket);
			this.GameInterval(socket);
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

	private GameInterval(socket): void {
		this.matchRepo.initNewMatch().then(gameScore => {
			this.state.match = gameScore;
			if (this.gameInterval) clearInterval(this.gameInterval);
	
			this.gameInterval = setInterval(() => {
				this.handleEndOfGame(socket);
				CPU.Action(this.state);
				handleCollisions(this.canvas, this.state);
				handleScore(this.canvas, this.state, socket);
				socket.emit('gameState', this.state);
			}, 1000 / 24);
		});
	}

	private handleEndOfGame(socket): void {
		if (
			this.state.match.score.playerOne >= C.MAX_SCORE ||
			this.state.match.score.playerTwo >= C.MAX_SCORE
		) {
			this.pongService.saveMatch(this.state.match).then((match) => {
				this.state.match.score.playerOne = 0;
				this.state.match.score.playerTwo = 0;
				this.state.started = false;
				// this.matchRepo.initNewMatch();
				socket.emit('endOfGame', match);
				socket.emit('gameScore', this.state.match);
				console.log('Succesfully saved');

				// this.gameScoreRepository
				// .findAllMatches()
				// .then((allMatches) => {
				// 	console.log('All game scores:', allMatches);
				// });
			})
			.catch((error) => {
				console.log('Error saving GameScore', error);
			});
		}
	}

	private handleSocketDisconnection(socket): void {
		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id);
		});
	}
}

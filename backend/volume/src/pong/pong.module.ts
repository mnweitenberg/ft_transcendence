import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { Server } from 'socket.io';
import {
	initCanvas,
	initializeGameState,
	handleScore,
	CPU,
	handleCollisions,
} from './pongLogic/PongLogic';
import * as i from './pongLogic/interfaces';
import * as C from './pongLogic/constants';
import { Score } from './gameScore/entities/gamescore.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameScoreRepository } from './gameScore/GameScore.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Score])],
	providers: [PongService, GameScoreRepository],
})
export class PongModule {
	private state: i.GameState;
	private canvas: i.Canvas;
	private gameInterval: NodeJS.Timeout | null = null;

	constructor(
		private readonly pongService: PongService,
		private readonly gameScoreRepository: GameScoreRepository, // Inject the GameScoreRepository
	) {
		this.canvas = initCanvas();
		this.state = initializeGameState(this.canvas);
		this.setupSocketServer();
	}

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
		if (this.gameInterval) clearInterval(this.gameInterval);

		this.gameInterval = setInterval(() => {
			this.handleEndOfGame(socket);
			CPU.Action(this.state);
			handleCollisions(this.canvas, this.state);
			handleScore(this.canvas, this.state, socket);
			socket.emit('gameState', this.state);
		}, 1000 / 24);
	}

	private handleEndOfGame(socket): void {
		if (
			this.state.gameScore.score.playerOne >= C.MAX_SCORE ||
			this.state.gameScore.score.playerTwo >= C.MAX_SCORE
		) {
			this.pongService
				.saveGameScore(this.state.gameScore)
				.then((score) => {
					socket.emit('endOfGame', this.state.gameScore);
					this.state.gameScore.score.playerOne = 0;
					this.state.gameScore.score.playerTwo = 0;
					socket.emit('gameScore', this.state.gameScore);
					console.log('Succesfully saved');

					this.gameScoreRepository
						.findAllGameScores()
						.then((allGameScores) => {
							console.log('All game scores:', allGameScores);
						});
				})
				.catch((error) => {
					console.log('Error saving GameScore', error);
				});
		}
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

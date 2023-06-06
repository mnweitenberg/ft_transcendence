import {
	WebSocketServer,
	WebSocketGateway,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as i from './interfaces';
import { MatchRepository } from './match/match.repository';
import * as C from './constants';
import { GameLogicService } from './gameLogic.service';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';
import { JwtWsGuard } from 'src/auth/guards/jwt-auth.guard';
import { PongService } from './pong.service';
import { Optional } from '@nestjs/common';

@UseGuards(JwtWsGuard)
@WebSocketGateway({
	cors: {
	  credentials: true,
	  origin: 'http://localhost:5574',
	},
  })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly gameLogicService: GameLogicService,
		private readonly pongService: PongService,
	) {
		this.state = this.pongService.initializeGameState();
		this.startLoop();
		// this.startNewGame();
	}

	private loopInterval: NodeJS.Timeout;
	private gameInterval: NodeJS.Timeout;
	private state: i.GameState = this.pongService.initializeGameState();

	private startLoop() {
		setInterval(() => this.startNewGame(), 1000);
	}

	private async startNewGame() {
		if (this.state.gameIsRunning) return;
		if (!this.state.match) this.state.match = await this.matchRepo.initNewMatch();
		if (!this.state.match) {
			this.server.emit('noPlayers');
			return;
		}
		this.state.gameIsRunning = true;
		this.server.emit('players', [
			this.state.match.players[0],
			this.state.match.players[1],
		]);
		this.gameInterval = setInterval(() => this.updateGameState(), 1000 / 24);
	}

	private async updateGameState() {
		if (!this.state.match) return;
		this.server.emit('gameState', this.state);
		await this.handleEndOfGame();
		if (!this.state.match || this.state.match.isFinished) return;
		this.state = await this.gameLogicService.runGame(this.state);
		this.server.emit('playerScored', [
			this.state.match.p1Score,
			this.state.match.p2Score,
		]);
	}

	private async handleEndOfGame() {
		const { p1Score, p2Score } = this.state.match;
		if (p1Score >= C.MAX_SCORE || p2Score >= C.MAX_SCORE ) {
			clearInterval(this.gameInterval);
			this.state.match.isFinished = true;
			await this.matchRepo.saveMatch(this.state.match);
			this.state = this.pongService.initializeGameState();
			this.state.match = await this.matchRepo.initNewMatch();
		}
	}

	handleConnection( client: Socket ): void {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket): void {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('PaddlePosition')
	handlePaddlePosition(@AuthUser() user: UserInfo, client: Socket, data: any): void {
		// const player = this.determinePlayer();
		// console.log('user.uuid ', user.userUid);
		// if (!player || !data) return;
		// console.log('data ', data);
		if (!data || data.mouseY) return;
		console.log('data.mouseY ', data.mouseY);
		// console.log('player', player);
		// player.paddle.y = data.mouseY;
	}

	@SubscribeMessage('enlargePaddle')
	handleEnlargePaddle(@AuthUser() user: UserInfo): void {
		const player = this.determinePlayer(user);
		if (!player) return;
		if (player.paddle.height < C.HEIGHT) player.paddle.height *= 1.2;
	}

	@SubscribeMessage('reducePaddle')
	handleReducePaddle(@AuthUser() user: UserInfo): void {
		const player = this.determinePlayer(user);
		if (!player) return;
		if (player.paddle.height > C.PADDLE_HEIGHT) player.paddle.height *= 0.8;
	}

	@UseGuards(JwtWsGuard)
	determinePlayer(@AuthUser() user: UserInfo | null): i.Player {
		if (!this.state || !this.state.match || !user) return;
		if (user.userUid === this.state.match.players[0].id) return this.state.p1;
		if (user.userUid === this.state.match.players[1].id) return this.state.p2;
		new Error('Client is not a player in this game');
		return;
	}

}

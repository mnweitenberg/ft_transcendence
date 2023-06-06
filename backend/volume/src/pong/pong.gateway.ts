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
import { QueueService } from './queue/queue.service';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';
import { JwtWsGuard } from 'src/auth/guards/jwt-auth.guard';
import { PongService } from './pong.service';
// import { WsResponse } from '@nestjs/websockets';

// by default will listen to same port http is listening on
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
		private readonly queueService: QueueService,
		private readonly matchRepo: MatchRepository,
		private readonly gameLogicService: GameLogicService,
		private readonly pongService: PongService,
	) {}

	private state: i.GameState = this.pongService.initializeGameState();
	// private user: UserInfo;

	@UseGuards(JwtWsGuard)
	async handleConnection(
		client: Socket,
		@AuthUser() user: UserInfo,
	): Promise<void> {
		console.log(`Client connected: ${client.id}`);
		console.log('user', user);
	}

	handleDisconnect(client: Socket): void {
		console.log(`Client disconnected: ${client.id}`);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('startNewGame')
	handleNewGame(@AuthUser() user: UserInfo): void {
		console.log('New game started');
		console.log('user', user);
		this.startNewGame();
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('PaddlePosition')
	handlePaddlePosition(@AuthUser() user: UserInfo, client: Socket, data: any): void {
		const player = this.determinePlayer(user.userUid);
		console.log('player', player);
		if (!player || !data) return;
		player.paddle.y = data.mouseY;
	}
	// @UseGuards(JwtWsGuard)
	// @SubscribeMessage('PaddlePosition')
	// handlePaddlePosition(@AuthUser() user: UserInfo, data: any): void {
	// 	const player = this.determinePlayer(user.userUid);
	// 	if (!player) return;
	// 	player.paddle.y = data.mouseY;
	// }
	// @SubscribeMessage('mouseClick')
	// handleMouseClick(client: Socket, data: any): void {
	// 	const player = this.determinePlayer(data.id);
	// 	if (!player) return;
	// 	this.gameLogicService.serveBall(this.state, player);
	// }

	// @SubscribeMessage('enlargePaddle')
	// handleEnlargePaddle(client: Socket, data: any): void {
	// 	const player = this.determinePlayer(data.id);
	// 	if (!player) return;
	// 	if (player.paddle.height < C.HEIGHT) player.paddle.height *= 1.2;
	// }

	// @UseGuards(JwtWsGuard)
	// @SubscribeMessage('reducePaddle')
	// handleReducePaddle(@AuthUser() user: UserInfo): void {
	// 	const player = this.determinePlayer(user.userUid);
	// 	if (!player) return;
	// 	if (player.paddle.height > C.PADDLE_HEIGHT) player.paddle.height *= 0.8;
	// }

	private async startNewGame() {
		console.log('Starting new game');
		await this.queueService.createMatches();
		this.state = this.pongService.initializeGameState();
		this.state.match = await this.matchRepo.initNewMatch();
		if (!this.state.match) {
			this.server.emit('noPlayers');
			console.log('No match found');
			return;
		}
		this.server.emit('players', [
			this.state.match.players[0],
			this.state.match.players[1],
		]);
		// console.log('state.ball.ySpeed', this.state.ball.ySpeed);
		setInterval(() => this.updateGameState(), 1000 / 24);
	}

	private async updateGameState() {
		if (!this.state.match || this.state.match.isFinished) return;
		this.state = await this.gameLogicService.runGame(this.state);
		this.server.emit('playerScored', [
			this.state.match.p1Score,
			this.state.match.p2Score,
		]);
		this.server.emit('gameState', this.state);
		// this.server.to(gameId).emit('gameState', game);
	}

	// @UseGuards(JwtWsGuard)
	// private determinePlayer(@AuthUser() user: UserInfo): i.Player {
	// 	if (!this.state || !this.state.match) return;
	// 	if (user.userUid === this.state.match.players[0].id) return this.state.p1;
	// 	if (user.userUid === this.state.match.players[1].id) return this.state.p2;
	// 	new Error('Client is not a player in this game');
	// 	return;
	// }

	private determinePlayer(id: string): i.Player {
		if (!this.state || !this.state.match) return;
		if (id === this.state.match.players[0].id) return this.state.p1;
		if (id === this.state.match.players[1].id) return this.state.p2;
		new Error('Client is not a player in this game');
		return;
	}

}

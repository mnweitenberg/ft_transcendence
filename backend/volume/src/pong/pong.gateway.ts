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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// by default will listen to same port http is listening on
@WebSocketGateway({
	cors: {
	  credentials: true,
	  origin: '*',
	},
  })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;

	constructor(
		private readonly queueService: QueueService,
		private readonly matchRepo: MatchRepository,
		private readonly gameLogicService: GameLogicService,
	) {}

	private state: i.GameState = this.initializeGameState();

	@UseGuards(JwtAuthGuard)
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

	@SubscribeMessage('startNewGame')
	handleNewGame(client: Socket, data: any): void {
		console.log('New game started');
		this.startNewGame();
	}

	@SubscribeMessage('PaddlePosition')
	handlePaddlePosition(client: Socket, data: any): void {
		const player = this.determinePlayer(data.id);
		if (!player) return;
		player.paddle.y = data.mouseY;
	}

	@SubscribeMessage('mouseClick')
	handleMouseClick(client: Socket, data: any): void {
		const player = this.determinePlayer(data.id);
		if (!player) return;
		this.gameLogicService.serveBall(this.state, player);
	}

	@SubscribeMessage('enlargePaddle')
	handleEnlargePaddle(client: Socket, data: any): void {
		const player = this.determinePlayer(data.id);
		if (!player) return;
		if (player.paddle.height < C.HEIGHT) player.paddle.height *= 1.2;
	}

	@SubscribeMessage('reducePaddle')
	handleReducePaddle(client: Socket, data: any): void {
		const player = this.determinePlayer(data.id);
		if (!player) return;
		if (player.paddle.height > C.PADDLE_HEIGHT) player.paddle.height *= 0.8;
	}

	private async startNewGame() {
		console.log('Starting new game');
		await this.queueService.createMatches();
		this.state = this.initializeGameState();
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

	// private determinePlayer(id: string): i.Player {
	// 	if (!this.state || !this.state.match) return;
	// 	if (id === this.state.match.players[0].id) return this.state.p1;
	// 	if (id === this.state.match.players[1].id) return this.state.p2;
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

	private initializeGameState(): i.GameState {
		const paddleLeft: i.Paddle = {
			x: C.BORDER_OFFSET,
			y: C.HEIGHT / 2 + C.PADDLE_HEIGHT / 2,
			height: C.PADDLE_HEIGHT,
		};

		const paddleRight: i.Paddle = {
			x: C.WIDTH - C.BORDER_OFFSET - C.PADDLE_WIDTH,
			y: C.HEIGHT / 2,
			height: C.PADDLE_HEIGHT,
		};

		const p1: i.Player = {
			paddle: paddleLeft,
			isServing: false,
		};

		const p2: i.Player = {
			paddle: paddleRight,
			isServing: true,
		};

		const ball: i.Ball = {
			x: paddleRight.x,
			y: paddleRight.y + C.PADDLE_HEIGHT / 2,
			xSpeed: -C.BALL_SPEED,
			ySpeed: C.BALL_SPEED,
		};

		const state: i.GameState = {
			ballIsInPlay: false,
			p1,
			p2,
			ball,
		};
		console.log('C.BALL_SPEED', C.BALL_SPEED);
		return state;
	}
}

// import {
// 	WebSocketServer,
// 	WebSocketGateway,
// 	SubscribeMessage,
// 	OnGatewayConnection,
// 	OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { PongService } from './pong.service';
// import * as i from './interfaces';
// import { MatchRepository } from './match/match.repository';
// import * as C from './constants';

// @WebSocketGateway(4243, { cors: { origin: '*' } })
// export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
// 	@WebSocketServer() server: Server;
// 	private games = new Map<string, i.GameState>();
// 	private clientToGame = new Map<string, string>();

// 	constructor(
// 		private readonly pongService: PongService,
// 		private readonly matchRepo: MatchRepository,
// 	) {}

// 	async handleConnection(client: Socket): Promise<void> {
// 		try {
// 			console.log(`Client connected: ${client.id}`);
// 			const match = await this.state.matchRepo.initNewMatch();
// 			if (!match) return;
// 			const state = await this.pongService.startMatch(match);
// 			this.games.set(client.id, state);
// 			setInterval(() => this.updateGameState(client.id), 1000 / 24);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	handleDisconnect(client: Socket): void {
// 		console.log(`Client disconnected: ${client.id}`);
// 		const gameId = this.clientToGame.get(client.id);
// 		if (gameId) {
// 			this.games.delete(gameId);
// 			this.clientToGame.delete(client.id);
// 		}
// 	}

// 	@SubscribeMessage('PaddlePosition')
// 	handlePaddlePosition(client: Socket, data: any): void {
// 		const game = this.games.get(this.clientToGame.get(data.id));
// 		if (!game) return;
// 		console.log(data.mouseY);
// 		const player = this.determinePlayer(data.id, game);
// 		player.paddle.y = data.mouseY;
// 	}

// 	@SubscribeMessage('mouseClick')
// 	handleMouseClick(client: Socket, data: any): void {
// 		// const game = this.games.get(client.id);
// 		// this.gameLogicService.serveBall(game);
// 		console.log('mouseClick', data.id);
// 	}

// 	@SubscribeMessage('enlargePaddle')
// 	handleEnlargePaddle(client: Socket, data: any): void {
// 		const game = this.games.get(client.id);
// 		if (!game) return;
// 		const player = this.determinePlayer(data.id, game);
// 		if (player.paddle.height < C.HEIGHT) player.paddle.height *= 1.2;
// 	}

// 	@SubscribeMessage('reducePaddle')
// 	handleReducePaddle(client: Socket, data: any): void {
// 		const game = this.games.get(client.id);
// 		if (!game) return;
// 		const player = this.determinePlayer(data.id, game);
// 		if (player.paddle.height > C.PADDLE_HEIGHT) player.paddle.height *= 0.8;
// 	}

// 	private async updateGameState(clientId: string) {
// 		const gameId = this.clientToGame.get(clientId);
// 		const game = this.games.get(gameId);
// 		if (game) {
// 			const state = await this.pongService.startMatch(game);
// 			this.server.to(gameId).emit('gameState', game);
// 			console.log(state);
// 		}
// 	}

// 	private determinePlayer(id: string, state: i.GameState): i.Player {
// 		if (id === state.match.players[0].id) return state.p1;
// 		if (id === state.match.players[1].id) return state.p2;
// 		new Error('Client is not a player in this game');
// 	}
// }

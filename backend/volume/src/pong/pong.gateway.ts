import {
	WebSocketServer,
	WebSocketGateway,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from './pong.service';
import * as i from './interfaces';
import { MatchRepository } from './match/match.repository';
import * as C from './constants';
import { Match } from './match/entities/match.entity';
import { GameLogicService } from './gameLogic.service';

@WebSocketGateway(4243, { cors: { origin: '*' } })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private state: i.GameState = this.pongService.initializeGameState();

	constructor(
		private readonly pongService: PongService,
		private readonly matchRepo: MatchRepository,
		private readonly gameService: GameLogicService,
	) {}

	async handleConnection(client: Socket): Promise<void> {
		try {
			console.log(`Client connected: ${client.id}`);
			this.state.match = await this.matchRepo.initNewMatch();
			if (!this.state.match) return;
			this.server.emit('players', [
				this.state.match.players[0],
				this.state.match.players[1],
			]);
			setInterval(() => this.updateGameState(), 100000 / 24);
		} catch (error) {
			console.log(error);
		}
	}

	handleDisconnect(client: Socket): void {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('PaddlePosition')
	handlePaddlePosition(client: Socket, data: any): void {
		if (!this.state.match) return;
		// console.log(data.mouseY);
		// const player = this.determinePlayer(data.id);
		// player.paddle.y = data.mouseY;
	}

	@SubscribeMessage('mouseClick')
	handleMouseClick(client: Socket, data: any): void {
		// const game = this.games.get(client.id);
		// this.gameLogicService.serveBall(game);
		console.log('mouseClick', data.id);
	}

	@SubscribeMessage('enlargePaddle')
	handleEnlargePaddle(client: Socket, data: any): void {
		if (!this.state.match) return;
		const player = this.determinePlayer(data.id);
		if (player.paddle.height < C.HEIGHT) player.paddle.height *= 1.2;
	}

	@SubscribeMessage('reducePaddle')
	handleReducePaddle(client: Socket, data: any): void {
		if (!this.state.match) return;
		const player = this.determinePlayer(data.id);
		if (player.paddle.height > C.PADDLE_HEIGHT) player.paddle.height *= 0.8;
	}

	private async updateGameState() {
		if (!this.state.match || this.state.match.isFinished) return;
		await this.gameService.runGame(this.state);
		this.server.emit('playerScored', [
			this.state.match.playerOneScore,
			this.state.match.playerTwoScore,
		]);
		this.server.emit('gameState', this.state);
		// this.server.to(gameId).emit('gameState', game);
		// console.log(state);
	}

	private determinePlayer(id: string): i.Player {
		if (id === this.state.match.players[0].id) return this.state.p1;
		if (id === this.state.match.players[1].id) return this.state.p2;
		new Error('Client is not a player in this game');
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

import {
	WebSocketServer,
	WebSocketGateway,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as C from './constants';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/user-info.interface';
import { JwtWsGuard } from 'src/auth/guards/jwt-auth.guard';
import { PongService } from './pong.service';

@WebSocketGateway({
	cors: {
		credentials: true,
		origin: `https://${process.env['DOMAIN']}/`,
	},
})
@UseGuards(JwtWsGuard)
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly pongService: PongService) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket): Promise<void> {
		console.log(`Client connected: ${client.id}`);

		this.pongService.startLoop();
		this.handleEmits();
	}

	handleDisconnect(client: Socket): void {
		console.log(`Client disconnected: ${client.id}`);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('PaddlePosition')
	handlePaddlePosition(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any,
		@AuthUser() user: UserInfo,
	): void {
		const player = this.pongService.determinePlayer(user);
		if (!data || !data.mouseY || !player) return;
		player.paddle.y = data.mouseY;
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('enlargePaddle')
	handleEnlargePaddle(@AuthUser() user: UserInfo): void {
		const player = this.pongService.determinePlayer(user);
		if (!player) return;
		if (player.paddle.height < C.HEIGHT) player.paddle.height *= 1.2;
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('reducePaddle')
	handleReducePaddle(@AuthUser() user: UserInfo): void {
		const player = this.pongService.determinePlayer(user);
		if (!player) return;
		if (player.paddle.height > C.PADDLE_HEIGHT) player.paddle.height *= 0.8;
	}

	private handleEmits() {
		this.pongService.on('noPlayers', () => {
			this.server.emit('noPlayers');
		});

		this.pongService.on('players', (players) => {
			this.server.emit('players', players);
		});

		this.pongService.on('gameState', (state) => {
			this.server.emit('gameState', state);
		});

		this.pongService.on('playerScored', (score) => {
			this.server.emit('playerScored', score);
		});

		this.pongService.on('gameIsFinished', () => {
			this.server.emit('gameIsFinished');
		});
	}
}

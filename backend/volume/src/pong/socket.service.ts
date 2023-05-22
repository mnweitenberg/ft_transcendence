// import { Injectable } from '@nestjs/common';
// import { Server } from 'socket.io';
// import * as i from './interfaces';
// import { GameLogicService } from './gameLogic.service';

// @Injectable()
// export class SocketService {
// 	private socket;
// 	constructor(private readonly gameLogicService: GameLogicService) {}

// 	setupSocketServer(state: i.GameState, canvas: i.Canvas): void {
// 		const io = new Server(4243, { cors: { origin: '*' } });
// 		io.on('connection', (socket) => {
// 			console.log('Client connected:', socket.id);
// 			if (!this.socket) this.socket = socket;
// 			this.handleSocketEvents(state, canvas);
// 			this.gameLogicService.runGame(this.socket, state, canvas);
// 			this.handleSocketDisconnection(socket);
// 		});
// 	}

// 	handleSocketDisconnection(socket): void {
// 		socket.on('disconnect', () => {
// 			console.log('Client disconnected:', socket.id);
// 		});
// 	}

// 	private handleSocketEvents(state: i.GameState, canvas: i.Canvas): void {
// 		if (!this.socket) return;

// 		this.socket.on('sendMouseY', (data) => {
// 			state.paddleRight.y = data.mouseY;
// 		});

// 		this.socket.on('mouseClick', (data) => {
// 			if (data.mouseClick && !state.isStarted) {
// 				state.isStarted = true;
// 				this.socket.emit('playerScored', [0, 0]);
// 			} else if (data.mouseClick && !state.ballIsInPlay) {
// 				this.gameLogicService.serveBall(state);
// 			}
// 		});

// 		this.socket.on('enlargePaddle', () => {
// 			if (state.paddleRight.height < canvas.height) {
// 				state.paddleRight.height *= 1.2;
// 			}
// 		});

// 		this.socket.on('reducePaddle', () => {
// 			if (state.paddleRight.height > canvas.paddleHeight) {
// 				state.paddleRight.height *= 0.8;
// 			}
// 		});
// 	}
// }

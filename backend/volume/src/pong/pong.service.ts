import * as i from './interfaces';
import * as C from './constants';
import { EventEmitter } from 'events';
import { MatchRepository } from './match/match.repository';
import { GameLogicService } from './gameLogic.service';
import { Injectable } from '@nestjs/common';
import { UserInfo } from 'src/auth/auth.service';
import { RankingService } from './ranking/ranking.service';

@Injectable()
export class PongService {
	private readonly emitter: EventEmitter;
	private gameInterval: NodeJS.Timeout;
	private state: i.GameState;

	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly rankingService: RankingService,
		private readonly gameLogicService: GameLogicService,
	) {
		this.emitter = new EventEmitter();
		this.state = this.initializeGameState();
	}

	on(event: string, listener: (...args: any[]) => void) {
		this.emitter.on(event, listener);
	}

	startLoop() {
		setInterval(() => this.startNewGame(), 1000);
	}

	private async startNewGame() {
		if (this.state.gameIsRunning) return;
		if (!this.state.match)
			this.state.match = await this.matchRepo.initNewMatch();
		if (!this.state.match) {
			this.emitter.emit('noPlayers');
			return;
		}
		this.state.gameIsRunning = true;
		this.emitter.emit('players', [
			this.state.match.players[0],
			this.state.match.players[1],
		]);
		this.gameInterval = setInterval(
			() => this.updateGameState(),
			C.REFRESH_RATE,
		);
	}

	private async updateGameState() {
		if (!this.state.match) return;
		this.emitter.emit('gameState', this.state);
		await this.handleEndOfGame();
		if (!this.state.match || this.state.match.isFinished) return;
		this.state = await this.gameLogicService.runGame(this.state);
		this.emitter.emit('playerScored', [
			this.state.match.p1Score,
			this.state.match.p2Score,
		]);
	}

	private async handleEndOfGame() {
		const { p1Score, p2Score } = this.state.match;
		if (p1Score >= C.MAX_SCORE || p2Score >= C.MAX_SCORE) {
			clearInterval(this.gameInterval);
			this.state.match.isFinished = true;
			await this.matchRepo.saveMatch(this.state.match);
			await this.rankingService.updateRanking(
				this.state.match,
				this.state.match.players[0],
				this.state.match.players[1],
			);
			this.state = this.initializeGameState();
		}
	}

	determinePlayer(user: UserInfo): i.Player {
		if (!this.state || !this.state.match) return;
		if (user.userUid === this.state.match.players[0].id)
			return this.state.p1;
		if (user.userUid === this.state.match.players[1].id)
			return this.state.p2;
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
			gameIsRunning: false,
			ballIsInPlay: false,
			p1,
			p2,
			ball,
		};

		return state;
	}
}

import { Injectable } from '@nestjs/common';
import * as i from './pongLogic/interfaces';
import * as C from './pongLogic/constants';
import { Score } from './gameScore/entities/gamescore.entity';
import { GameScoreRepository } from './gameScore/GameScore.repository';
import { GameScoreDto } from './gameScore/dto/gamescore.dto';

@Injectable()
export class PongService {
	constructor(private readonly gameScoreRepository: GameScoreRepository) {}

	public async saveGameScore(score: i.GameScore): Promise<Score> {
		const gameScoreDto: GameScoreDto = {
			playerOneID: score.playerOne.id,
			playerOneScore: score.score.playerOne,
			playerTwoID: score.playerTwo.id,
			playerTwoScore: score.score.playerTwo,
		};

		const scoreEntity = new Score();
		scoreEntity.playerOneID = gameScoreDto.playerOneID;
		scoreEntity.playerOneScore = gameScoreDto.playerOneScore;
		scoreEntity.playerTwoID = gameScoreDto.playerTwoID;
		scoreEntity.playerTwoScore = gameScoreDto.playerTwoScore;

		return this.gameScoreRepository.saveGameScore(scoreEntity);
	}

	enlargePaddle(canvas: i.Canvas, state: i.GameState): void {
		if (state.paddleRight.height < canvas.height) {
			state.paddleRight.height *= 1.2;
		}
	}

	reducePaddle(canvas: i.Canvas, state: i.GameState): void {
		if (state.paddleRight.height > canvas.paddleHeight) {
			state.paddleRight.height *= 0.8;
		}
	}

	handleMouseYUpdate(mouseY: number, state: i.GameState): void {
		state.paddleRight.y = mouseY;
	}

	handleMouseClick(mouseClick: boolean, state: i.GameState): void {
		if (mouseClick && !state.started) {
			this.startGame(state);
		}
	}

	private startGame(state: i.GameState): void {
		state.started = true;
		console.log('Ball is in play');

		if (state.serveLeft.state) state.ball.xSpeed = C.BALL_SPEED;
		if (state.serveRight.state) state.ball.xSpeed = -C.BALL_SPEED;
		state.serveRight.state = false;
	}
}

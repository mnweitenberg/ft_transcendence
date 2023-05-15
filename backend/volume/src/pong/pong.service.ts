import { Injectable } from '@nestjs/common';
import * as i from './pongLogic/interfaces';
import * as C from './pongLogic/constants';
import { Match } from './match/entities/match.entity';
import { MatchRepository } from './match/Match.repository';
import { GameScoreDto } from './match/dto/match.dto';

@Injectable()
export class PongService {
	constructor(private readonly matchRepository: MatchRepository) {}

	// public async saveMatch(score: i.GameScore): Promise<Match> {
	// 	const gameScoreDto: GameScoreDto = {
	// 		playerOne: score.playerOne,
	// 		playerOneScore: score.score.playerOne,
	// 		playerTwo: score.playerTwo,
	// 		playerTwoScore: score.score.playerTwo,
	// 	};

	// 	const scoreEntity = new Match();
	// 	scoreEntity.playerOne = gameScoreDto.playerOne;
	// 	scoreEntity.playerOneScore = gameScoreDto.playerOneScore;
	// 	scoreEntity.playerTwo = gameScoreDto.playerTwo;
	// 	scoreEntity.playerTwoScore = gameScoreDto.playerTwoScore;

	// 	return this.matchRepository.saveMatch(scoreEntity);
	// }

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

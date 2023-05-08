import { Injectable } from '@nestjs/common';
import { handleMouseMove, CPU, handleCollisions } from './gameLogic/gameLogic';
import * as i from './gameLogic/interfaces';

@Injectable()
export class PongService {
	private gameInterval: NodeJS.Timeout | null = null;

	handleMouseYUpdate(mouseY: number, state: i.GameState): void {
		handleMouseMove(mouseY, state);
	}

	handleMouseClick(mouseClick: boolean, state: i.GameState): void {
		if (mouseClick && !state.started) {
			this.startGame(state);
		}
		if (mouseClick) {
			console.log(
				'Score: ',
				state.score.playerOne,
				state.score.playerTwo,
			);
		}
	}

	private startGame(state: i.GameState): void {
		state.started = true;
		console.log('Game started');
		if (state.serveLeft.state) {
			state.ball.xSpeed = Math.abs(state.ball.xSpeed);
			console.log('Left player served');
		}
		if (state.serveRight.state) {
			state.ball.xSpeed = Math.abs(state.ball.xSpeed) * -1;
			console.log('Right player served');
		}
		state.serveLeft.state = false;
		state.serveRight.state = false;

		if (this.gameInterval) {
			clearInterval(this.gameInterval);
		}

		this.gameInterval = setInterval(() => {
			handleCollisions(state);
			CPU.Action(state);
		}, 1000 / 60);
	}
}

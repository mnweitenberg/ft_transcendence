import { Injectable } from '@nestjs/common';
import * as i from './game/interfaces';

@Injectable()
export class PongService {
	handleMouseYUpdate(mouseY: number, state: i.GameState): void {
		state.paddleRight.y = mouseY;
		// console.log(state.paddleRight.y);
	}

	handleMouseClick(mouseClick: boolean, state: i.GameState): void {
		if (mouseClick && !state.started) {
			this.startGame(state);
		}
	}

	private startGame(state: i.GameState): void {
		state.started = true;
		console.log('Game started');

		if (state.serveRight.state) {
			state.ball.xSpeed = state.ball.defaultSpeed * -1;
			console.log('Right player served');
		}
		state.serveRight.state = false;
	}
}

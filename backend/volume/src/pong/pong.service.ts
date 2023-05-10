import { Injectable } from '@nestjs/common';
import * as i from './game/interfaces';
import * as C from './game/constants';

@Injectable()
export class PongService {
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
		console.log('Game started');

		if (state.serveRight.state) {
			state.ball.xSpeed = C.BALL_SPEED * -1;
			console.log('Right player served');
		}
		state.serveRight.state = false;
	}
}

import * as C from './constants';
import * as i from './interfaces';

export function Action(state: i.GameState): void {
	if (state.ballIsInPlay) Move(state);
}

function Move(state: i.GameState): void {
	if (!state.ballIsInPlay) return;
	if (state.serveRight.isServing) return;
	if (state.serveLeft.isServing) return;

	if (state.ball.y > state.paddleLeft.y)
		state.paddleLeft.y += C.DEFAULT_CPU_SPEED;
	else state.paddleLeft.y -= C.DEFAULT_CPU_SPEED;
}

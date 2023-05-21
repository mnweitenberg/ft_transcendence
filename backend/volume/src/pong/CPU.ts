import * as C from './constants';
import * as i from './interfaces';

export function Action(state: i.GameState): void {
	if (state.serveLeft.state) setTimeout(() => Serve(state), C.CPU_TIMEMOUT);
	if (state.ballIsInPlay) Move(state);
}

function Serve(state: i.GameState): void {
	state.ballIsInPlay = true;
	state.serveLeft.state = false;
}

function Move(state: i.GameState): void {
	if (!state.ballIsInPlay) return;
	if (state.serveRight.state) return;
	if (state.serveLeft.state) return;

	if (state.ball.y > state.paddleLeft.y)
		state.paddleLeft.y += C.DEFAULT_CPU_SPEED;
	else state.paddleLeft.y -= C.DEFAULT_CPU_SPEED;
}
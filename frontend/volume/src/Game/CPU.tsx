import * as CONST from "../Defines/Constants"
import * as i from "../Defines/Interfaces"

export function Action(state: i.GameState) : void {
	if (state.serveLeft.state) 
		setTimeout(() => Serve(state.started, state.serveLeft.state), CONST.CPU_TIMEMOUT);
	if (state.started)
		Move(state);
}

function Serve(started: boolean, serve: boolean) : void {
	started = true;
	serve = false;
}

function Move(state: i.GameState) : void {
	if (state.ball.y > state.paddleLeft.y)
		state.paddleLeft.y +=  CONST.DEFAULT_CPU_SPEED;
	else
		state.paddleLeft.y -=  CONST.DEFAULT_CPU_SPEED;
	
	// bound to play window
	if (state.paddleLeft.y <= 0)
		state.paddleLeft.y = 0;
	if (state.paddleLeft.y + CONST.PADDLE_HEIGHT >= state.canvasHeight )
		state.paddleLeft.y = state.canvasHeight - CONST.PADDLE_HEIGHT;
}


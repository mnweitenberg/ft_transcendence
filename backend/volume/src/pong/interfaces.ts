import { Match } from '../pong/match/entities/match.entity';

///////////////
//  CANVAS   //
///////////////
export interface Canvas {
	height: number;
	width: number;
	borderOffset: number;
	paddleHeight: number;
	paddleWidth: number;
	ballDiameter: number;
}

///////////////
// GAMESTATE //
///////////////
export interface Ball {
	x: number;
	y: number;
	xSpeed: number;
	ySpeed: number;
}

export interface Paddle {
	x: number;
	y: number;
	height?: number;
}

export interface ServeState {
	state: boolean;
	x: number;
	y: number;
}

export interface GameState {
	isStarted: boolean;
	ballIsInPlay: boolean;
	serveLeft: ServeState;
	serveRight: ServeState;
	ball: Ball;
	paddleLeft: Paddle;
	paddleRight: Paddle;
	match?: Match;
}

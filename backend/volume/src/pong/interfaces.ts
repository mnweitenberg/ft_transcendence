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

export interface Player {
	paddle: Paddle;
	isServing: boolean;
}

export interface GameState {
	gameIsRunning: boolean;
	ballIsInPlay: boolean;
	p1: Player;
	p2: Player;
	ball: Ball;
	match?: Match;
}

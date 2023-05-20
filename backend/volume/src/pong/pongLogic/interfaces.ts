import { User } from '../../user/entities/user.entity';

//////////
// CHAT //
//////////

export interface Chat {
	id: number;
	message: string;
	sender: User;
	reciever: User;
}

export interface Channel {
	name: string;
	avatar: string;
	creator: User;
	members: Array<User>;
}

export interface PrivateChannel extends Channel {
	password: string;
}

///////////////
//   SCORE   //
///////////////

interface Score {
	playerOne: number;
	playerTwo: number;
}

export interface GameScore {
	id: number;
	playerOne: User;
	playerTwo: User;
	score: Score;
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

export interface Canvas {
	height: number;
	width: number;
	borderOffset: number;
	paddleHeight: number;
	paddleWidth: number;
	ballDiameter: number;
}

export interface GameState {
	serveLeft: ServeState;
	serveRight: ServeState;
	started: boolean;
	ball: Ball;
	paddleLeft: Paddle;
	paddleRight: Paddle;
	gameScore?: GameScore;
}

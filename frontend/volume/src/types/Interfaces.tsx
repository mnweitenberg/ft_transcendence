import { ReactNode } from "react";

///////////////
// USERSTATS //
///////////////

export interface User {
	id: string;
	username: string;
	avatar: {
		file: string;
	};
}

///////////////
// GAMESTATE //
///////////////

export interface Canvas {
	height: number;
	width: number;
	borderOffset: number;
	paddleHeight: number;
	paddleWidth: number;
	ballSpeed: number;
	ballDiameter: number;
}

export interface Ball {
	x: number;
	y: number;
	xSpeed: number;
	ySpeed: number;
}

export interface Paddle {
	x: number;
	y: number;
	height: number;
}

export interface Player {
	paddle: Paddle;
	isServing: boolean;
}

export interface GameState {
	ballIsInPlay: boolean;
	p1: Player;
	p2: Player;
	ball: Ball;
}

///////////
// PROPS //
///////////

export interface ModalProps {
	userId: string;
	username: string;
	avatarfile: string;
	toggleModal: (content: JSX.Element) => void;
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	modalContent: JSX.Element | null;
	setContent: (content: JSX.Element) => void;
}

export interface PongProps {
	players: any[];
	setPlayers: (players: any[]) => void;
	playersAvailable: boolean;
	setPlayersAvailable: (playersAvailable: boolean) => void;
	score: number[];
	setScore: (score: number[]) => void;
	finished: boolean;
	setFinished: (finished: boolean) => void;
}

export interface CompProps {
	children: ReactNode;
}
///////////////
//	Avatar	 //
///////////////
export interface Avatar {
	file: string;
	filename: string;
}

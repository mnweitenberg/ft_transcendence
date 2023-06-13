//////////
// CHAT //
//////////

// export interface Chat {
// 	content: string;
// 	name?: string;
// 	class: 'user' | 'friend';
// }

export interface Chat {
	id: number;
	// date: Date;
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
// USERSTATS //
///////////////

interface Stats {
	ranking: number;
	wins: number;
	losses: number;
	score: number;
}

export interface User {
	id: string;
	username: string;
	avatar?: string;
	stats: Stats;
	// chat?: Array<Chat>;
	friends?: Array<User>;
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
	toggleModal: (content: JSX.Element) => void;
	selectedUser: any;
	setSelectedUser: (user: any) => void;
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	modalContent: JSX.Element | null;
	setContent: (content: JSX.Element) => void;
}

export interface PongProps {
	players: User[];
	setPlayers: (players: User[]) => void;
	playersAvailable: boolean;
	setPlayersAvailable: (playersAvailable: boolean) => void;
	score: number[];
	setScore: (score: number[]) => void;
	finished: boolean;
	setFinished: (finished: boolean) => void;
}

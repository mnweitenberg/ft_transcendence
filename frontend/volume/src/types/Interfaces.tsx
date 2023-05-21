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
	name: string;
	avatar: string;
	stats?: Stats;
	status?: "in game" | "online" | "offline" | "";
	// chat?: Array<Chat>;
	friends?: Array<User>;
}

///////////////
// GAMESTATE //
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

export interface Ball {
	x: number;
	y: number;
	xSpeed?: number;
	ySpeed?: number;
	defaultSpeed?: number;
}

export interface Paddle {
	x: number;
	y: number;
	height: number;
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

///////////
// PROPS //
///////////

export interface ModalProps {
	toggleModal: (user: User | null, content: JSX.Element) => void;
	selectedUser: User;
	setSelectedUser: (user: User) => void;
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	modalContent: JSX.Element;
	setContent: (content: JSX.Element) => void;
}

export interface PongProps {
	bothPlayersReady: boolean;
	setBothPlayersReady: (bothPlayersReady: boolean) => void;
	gameScore: GameScore;
	finished: boolean;
	setFinished: (finished: boolean) => void;
	goToMenu: boolean;
	setGoToMenu: (goToMenu: boolean) => void;
}

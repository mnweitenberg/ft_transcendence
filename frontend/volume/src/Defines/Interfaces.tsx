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
	stats: Stats;
	status: "in game" | "online" | "offline" | "";
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
	xSpeed: number;
	ySpeed: number;
};

export interface Paddle {
	x: number;
	y: number;
};

export interface ServeState {
	state: boolean;
	x: number;
	y: number;
}

export interface GameState {
	canvasHeight: number;
	canvasWidth: number;
	serveLeft: ServeState;
	serveRight: ServeState;
	started: boolean;
	ball: Ball;
	paddleLeft: Paddle;
	paddleRight: Paddle;
	score: GameScore;
}

///////////
// PROPS //
///////////

export interface ModalProps {
	selectedUser: User;
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	togglePopup: (user: User) => void;
	setSelectedUser: (user: User) => void;
}

export interface PongProps {
	bothPlayersReady: boolean;
	setBothPlayersReady: (bothPlayersReady: boolean) => void;
	gameScore: GameScore;
	resetScore: () => void;
	incrementScorePlayerOne: () => void;
	incrementScorePlayerTwo: () => void;
	finished: boolean;
	setFinished: (finished: boolean) => void;
	goToMenu: boolean;
	setGoToMenu: (goToMenu: boolean) => void;
}

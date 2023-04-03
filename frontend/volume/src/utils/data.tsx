import * as i from "../types/Interfaces";

///////////
// USERS //
///////////
export const marius: i.User = {
	name: "Marius",
	avatar: "/img/marius.png",
	stats: { ranking: 1, wins: 1, losses: 0, score: 3 },
	status: "in game",
};

export const justin: i.User = {
	name: "Justin",
	avatar: "/img/justin.png",
	stats: { ranking: 2, wins: 1, losses: 0, score: 3 },
	status: "in game",
};

export const jonathan: i.User = {
	name: "Jonathan",
	avatar: "/img/jonathan.png",
	stats: { ranking: 3, wins: 0, losses: 1, score: -1 },
	status: "online",
};

export const milan: i.User = {
	name: "Milan",
	avatar: "/img/milan.png",
	stats: { ranking: 4, wins: 0, losses: 1, score: -1 },
	friends: [justin, jonathan, marius],
	status: "online",
};

export const allUsers: Array<i.User> = [marius, justin, jonathan, milan];

export const user: i.User = milan;

///////////
// QUEUE //
///////////
export const queue: Array<i.GameScore> = [
	{
		id: 3,
		playerOne: user,
		playerTwo: marius,
		score: { playerOne: 0, playerTwo: 0 },
	},
	{
		id: 4,
		playerOne: jonathan,
		playerTwo: justin,
		score: { playerOne: 0, playerTwo: 0 },
	},
	{
		id: 5,
		playerOne: justin,
		playerTwo: user,
		score: { playerOne: 0, playerTwo: 0 },
	},
	{
		id: 6,
		playerOne: user,
		playerTwo: jonathan,
		score: { playerOne: 0, playerTwo: 0 },
	},
	// {
	// 	id:13,
	// 	playerOne: jonathan,
	// 	playerTwo: null,
	// 	score: {playerOne: 0, playerTwo: 0},
	// },
];

/////////////
// RANKING //
/////////////
export const ranking = [
	{
		rank: 1,
		user: marius,
	},
	{
		rank: 2,
		user: justin,
	},
	{
		rank: 3,
		user: jonathan,
	},
	{
		rank: 4,
		user: user,
	},
];

/////////////
// MATCHES //
/////////////
export const matchHistory: Array<i.GameScore> = [
	{
		id: 1,
		playerOne: justin,
		playerTwo: jonathan,
		score: { playerOne: 10, playerTwo: 6 },
	},
	{
		id: 2,
		playerOne: user,
		playerTwo: marius,
		score: { playerOne: 4, playerTwo: 10 },
	},
];

///////////
// CHATS //
///////////
export const chats: Array<i.Chat> = [
	{
		id: 1,
		message: "Top!",
		sender: marius,
		reciever: milan,
	},
	{
		id: 2,
		message: "werkt Client.cpp (van de meest recente push van jouw branch) bij jou?",
		sender: milan,
		reciever: justin,
	},
	{
		id: 3,
		message: "Nee,  deze werkt niet",
		sender: justin,
		reciever: milan,
	},
	{
		id: 4,
		message:
			"Ok, maakt niet uit, heb al een andere oplossing gevonden voor waar ik mee bezig ben : )",
		sender: milan,
		reciever: justin,
	},
	{
		id: 5,
		message:
			"Ik krijg op Codam de php-cgi niet meer aan de praat. Weet jij nog hoe jij die hier hebt geinstalleerd?",
		sender: jonathan,
		reciever: milan,
	},
	{
		id: 6,
		message: "brew install php dacht ik",
		sender: milan,
		reciever: jonathan,
	},
	{
		id: 7,
		message: "Lukt niet",
		sender: jonathan,
		reciever: milan,
	},
];

export const groupChat: Array<i.Chat> = [
	{
		id: 1,
		message: "Top!",
		sender: marius,
		reciever: milan,
	},
	{
		id: 2,
		message: "werkt Client.cpp (van de meest recente push van jouw branch) bij jou?",
		sender: milan,
		reciever: justin,
	},
	{
		id: 3,
		message: "Nee,  deze werkt niet",
		sender: justin,
		reciever: milan,
	},
	{
		id: 4,
		message:
			"Ok, maakt niet uit, heb al een andere oplossing gevonden voor waar ik mee bezig ben : )",
		sender: milan,
		reciever: justin,
	},
	{
		id: 5,
		message:
			"Ik krijg op Codam de php-cgi niet meer aan de praat. Weet jij nog hoe jij die hier hebt geinstalleerd?",
		sender: jonathan,
		reciever: milan,
	},
	{
		id: 6,
		message: "brew install php dacht ik",
		sender: milan,
		reciever: jonathan,
	},
	{
		id: 7,
		message: "Lukt niet",
		sender: jonathan,
		reciever: milan,
	},
];
// let groupChat = {
// 	name: "J4M GroupChat",
// 	avatar: "src/assets/img/groupchat.png",
// 	status: "",
// 	chat: chat_group,
// };

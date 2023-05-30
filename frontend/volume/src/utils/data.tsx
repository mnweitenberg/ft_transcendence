import * as i from "../types/Interfaces";

///////////
// USERS //
///////////
export const marius: i.User = {
	username: "Marius",
	avatar: "/img/marius.png",
	stats: { ranking: 1, wins: 1, losses: 0, score: 3 },
	status: "in game",
};

export const justin: i.User = {
	username: "Justin",
	avatar: "/img/justin.png",
	stats: { ranking: 2, wins: 1, losses: 0, score: 3 },
	status: "in game",
};

export const jonathan: i.User = {
	username: "Jonathan",
	avatar: "/img/jonathan.png",
	stats: { ranking: 3, wins: 0, losses: 1, score: -1 },
	status: "online",
};

export const milan: i.User = {
	username: "Milan",
	avatar: "/img/milan.png",
	stats: { ranking: 4, wins: 0, losses: 1, score: -1 },
	friends: [justin, jonathan, marius],
	status: "online",
};

export const allUsers: Array<i.User> = [marius, justin, jonathan, milan];

export const user: i.User = milan;
// export const user: i.User | null = null;

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
export const matchHistory: Array<any> = [
	{
		id: 1,
		p1: justin,
		p2: jonathan,
		score: { p1: 10, p2: 6 },
	},
	{
		id: 2,
		p1: user,
		p2: marius,
		score: { p1: 4, p2: 10 },
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

export const publicChannels: Array<i.Channel> = [
	{
		name: "channel1",
		avatar: "./img/milan2.png",
		creator: jonathan,
		members: [justin, jonathan, marius],
	},
	{
		name: "Crazy groupchat",
		avatar: "./img/milan.png",
		creator: justin,
		members: [justin, marius],
	},
];

export const privateChannels: Array<i.PrivateChannel> = [
	{
		name: "secret meeting",
		avatar: "./img/milan2.png",
		password: "asdf",
		creator: milan,
		members: [jonathan],
	},
	{
		name: "Crazy private groupchat",
		avatar: "./img/milan.png",
		password: "asdf",
		creator: justin,
		members: [justin, jonathan],
	},
];

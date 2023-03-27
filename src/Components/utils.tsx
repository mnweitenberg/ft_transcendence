import * as i from '../Defines/Interfaces';
import { matchHistory } from '../Defines/data';

export function getChatsByUser(chats: Array<i.Chat>, user: i.User): Array<i.Chat> {
	return chats.filter(
		(chat) => chat.sender === user || chat.reciever === user
	);
}

export function getMatchesByUser(matches: Array<i.GameScore>, player: i.User): Array<i.GameScore> {
	return matches.filter(
		(match) => match.playerOne === player || match.playerTwo === player
	);
}

export function getWinsByUser(matches: Array<i.GameScore>, user: i.User): Array<i.GameScore> {
	return getMatchesByUser(matches, user).filter(
		(match) => (match.playerOne === user && match.score.playerOne > match.score.playerTwo)
				|| (match.playerTwo === user && match.score.playerTwo > match.score.playerOne) 
	);
}

export function getLossesByUser(matches: Array<i.GameScore>, user: i.User): Array<i.GameScore> {
	return getMatchesByUser(matches, user).filter(
		(match) => (match.playerOne === user && match.score.playerOne < match.score.playerTwo)
				|| (match.playerTwo === user && match.score.playerTwo < match.score.playerOne) 
	);
}
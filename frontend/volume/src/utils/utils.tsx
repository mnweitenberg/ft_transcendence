import * as i from "../types/Interfaces";

export function getChatsByUser(chats: Array<i.Chat>, user: i.User): Array<i.Chat> {
	return chats.filter((chat) => chat.sender === user || chat.reciever === user);
}

export function getMatchesByUser(matches: Array<i.GameScore>, player: i.User): Array<i.GameScore> {
	return matches.filter((match) => match.playerOne === player || match.playerTwo === player);
}

export function getWinsByUser(matches: Array<i.GameScore>, user: i.User): Array<i.GameScore> {
	return getMatchesByUser(matches, user).filter(
		(match) =>
			(match.playerOne === user && match.score.playerOne > match.score.playerTwo) ||
			(match.playerTwo === user && match.score.playerTwo > match.score.playerOne)
	);
}

export function getLossesByUser(matches: Array<i.GameScore>, user: i.User): Array<i.GameScore> {
	return getMatchesByUser(matches, user).filter(
		(match) =>
			(match.playerOne === user && match.score.playerOne < match.score.playerTwo) ||
			(match.playerTwo === user && match.score.playerTwo < match.score.playerOne)
	);
}

// MESSAGES
export function createChallengeAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Challenge {props.selectedUser.name}? </h3>
			<button onClick={() => props.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createFriendRequesAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Send friend request to {props.selectedUser.name}? </h3>
			<button onClick={() => props.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createBlockAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Are you sure you want to block {props.selectedUser.name}? </h3>
			<button onClick={() => props.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createLeaveGroupChatAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Are you sure you want to leave the groupchat? </h3>
			<button onClick={() => props.setShowModal(false)}>Yes</button>
		</div>
	);
}

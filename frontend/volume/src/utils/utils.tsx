import * as i from "../types/Interfaces";

// export function getWinsByUser(matches: Array<i.GameScore>, user: i.User): Array<i.GameScore> {
// 	return getMatchesByUser(matches, user).filter(
// 		(match) =>
// 			(match.p1 === user && match.score.p1 > match.score.p2) ||
// 			(match.p2 === user && match.score.p2 > match.score.p1)
// 	);
// }

// export function getLossesByUser(matches: Array<i.GameScore>, user: i.User): Array<i.GameScore> {
// 	return getMatchesByUser(matches, user).filter(
// 		(match) =>
// 			(match.p1 === user && match.score.p1 < match.score.p2) ||
// 			(match.p2 === user && match.score.p2 < match.score.p1)
// 	);
// }

// MESSAGES
export function createChallengeAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Challenge {props.selectedUser.username}? </h3>
			<button onClick={() => props.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createFriendRequesAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Send friend request to {props.selectedUser.username}? </h3>
			<button onClick={() => props.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createBlockAlert(props: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Are you sure you want to block {props.selectedUser.username}? </h3>
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

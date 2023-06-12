import * as i from "../types/Interfaces";

export function createChallengeAlert(user: any, propsModal: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Challenge {user.username}? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createFriendRequesAlert(user: any, propsModal: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Send friend request to {user}? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createBlockAlert(user: any, propsModal: i.ModalProps) {
	return (
		<div className="alert">
			<h3>Are you sure you want to block {user}? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createLeaveGroupChatAlert(
	// user: any,
	propsModal: i.ModalProps
) {
	return (
		<div className="alert">
			<h3>Are you sure you want to leave the groupchat? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

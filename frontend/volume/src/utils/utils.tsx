import * as i from "../types/Interfaces";

export function createChallengeAlert({
	user,
	propsModal,
}: {
	user: any;
	propsModal: i.ModalProps;
}) {
	return (
		<div className="alert">
			<h3>Challenge {user.username}? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createFriendRequesAlert({
	user,
	propsModal,
}: {
	user: any;
	propsModal: i.ModalProps;
}) {
	return (
		<div className="alert">
			<h3>Send friend request to {user}? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createBlockAlert({ user, propsModal }: { user: any; propsModal: i.ModalProps }) {
	return (
		<div className="alert">
			<h3>Are you sure you want to block {user}? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

export function createLeaveGroupChatAlert({
	// user,
	propsModal,
}: {
	// user: any;
	propsModal: i.ModalProps;
}) {
	return (
		<div className="alert">
			<h3>Are you sure you want to leave the groupchat? </h3>
			<button onClick={() => propsModal.setShowModal(false)}>Yes</button>
		</div>
	);
}

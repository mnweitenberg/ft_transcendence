import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useEffect } from "react";
import { useState } from "react";
import { convertEncodedImage } from "src/utils/convertEncodedImage";

export const CHALLENGE_TIME_OUT = 9000;

const ACCEPT_CHALLENGE = gql`
	mutation AcceptChallenge($friendId: String!) {
		acceptChallenge(friend_id: $friendId)
	}
`;

const DENY_CHALLENGE = gql`
	mutation DenyChallenge($friendId: String!) {
		denyChallenge(friend_id: $friendId)
	}
`;

export default function ChallengeAlert({ user }: { user: any }) {
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		setShowModal(true);
	}, [user]);

	return (
		<>
			{showModal && (
				<div className="modal">
					<div className="modal-content">
						<div className="requestAlert">
							<div className="avatar_container">
								<img src={convertEncodedImage(user.avatar.file)} />
							</div>
							<div className="user_actions">
								<h1>{user.username}</h1>
								<p>{user.username} challenged you to play a game!</p>
							</div>
						</div>
						<AcceptChallenge friend_id={user.id} setShowModal={setShowModal} />
						<DenyChallenge friend_id={user.id} setShowModal={setShowModal} />
					</div>
				</div>
			)}
		</>
	);
}

function AcceptChallenge({ friend_id, setShowModal }: { friend_id: string; setShowModal: any }) {
	const [
		accept_friend,
		{ data: accept_data, loading: accept_loading, error: accept_error, called: accept_called },
	] = useMutation(ACCEPT_CHALLENGE);

	if (accept_loading) return <>Loading accept</>;
	if (accept_error) return <>Error accept</>;
	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					accept_friend({ variables: { friendId: friend_id } });
					setShowModal(false);
				}}
			>
				<button type="submit">Accept</button>
			</form>
		</div>
	);
}

function DenyChallenge({ friend_id, setShowModal }: { friend_id: string; setShowModal: any }) {
	const [
		deny_friend,
		{ data: accept_data, loading: accept_loading, error: accept_error, called: accept_called },
	] = useMutation(DENY_CHALLENGE);
	const [counter, setCounter] = useState(CHALLENGE_TIME_OUT / 1000);

	useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
	}, [counter]);

	useEffect(() => {
		const timer = setTimeout(() => {
			deny_friend({ variables: { friendId: friend_id } });
		}, CHALLENGE_TIME_OUT);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	if (accept_loading) return <>Loading accept</>;
	if (accept_error) return <>Error accept</>;
	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					deny_friend({ variables: { friendId: friend_id } });
					setShowModal(false);
				}}
			>
				<button type="submit">Deny ({counter} s)</button>
			</form>
		</div>
	);
}

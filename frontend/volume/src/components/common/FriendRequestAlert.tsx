import { useMutation } from "@apollo/client";
import * as i from "../../types/Interfaces";
import { gql } from "@apollo/client";

const INVITE_FRIEND = gql`
	mutation InviteFriend($friendId: String!) {
		inviteFriend(friend_id: $friendId)
	}
`;

export default function FriendRequestAlert(user: any, propsModal: i.ModalProps) {
	console.log(user);
	console.log(user.id);
	console.log(user.username);
	const [invite_friend, { data, loading, error }] = useMutation(INVITE_FRIEND);

	const handleFriendRequest = () => {
		invite_friend({ variables: { friendId: user.id } });
		propsModal.setShowModal(false);
	};

	if (loading) return <>Loading...</>;
	if (error) return <>Error: ${error.message}</>;

	return (
		<div className="alert">
			<h3>Send friend request to {user.username}?</h3>
			<button onClick={handleFriendRequest}>Yes</button>
		</div>
	);
}

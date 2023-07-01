import "../../styles/style.css";
import Stats from "./Stats";
import Friends from "./Friends";
import MatchHistory from "./MatchHistory";
import * as i from "../../types/Interfaces";
import { createChallengeAlert, createBlockAlert } from "../../utils/utils";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { useFriendsData } from "src/utils/useFriendsData";
import { gql, useMutation } from "@apollo/client";
import { useOutgoingRequests } from "src/utils/useOutgoingRequests";

export default function UserStats(modalProps: i.ModalProps & { selectedUser: any }) {
	const { friends, loading, error } = useFriendsData(modalProps.userId);
	const [remove_friend, { loading: loadingRemove, error: errorRemove }] =
		useMutation(REMOVE_FRIEND);
	const [invite_friend, { loading: loadingRequest, error: errorRequest }] =
		useMutation(INVITE_FRIEND);
	const {
		outgoingRequests,
		loading: loadingOutgoing,
		error: errorOutgoing,
	} = useOutgoingRequests(modalProps.userId);

	if (loading) return <> </>;
	if (loadingOutgoing) return <div>Loading friends</div>;
	if (loadingRemove) return <> </>;
	if (loadingRequest) return <>send friend request</>;

	if (error) return <div>Error friends</div>;
	if (errorOutgoing) return <>error</>;
	if (errorRemove) return <>error</>;
	if (errorRequest) return <>error</>;

	const renderUserActions = () => {
		if (modalProps.selectedUser.id === modalProps.userId)
			return (
				<div className="user_actions">
					<h1>{modalProps.selectedUser.username}</h1>
				</div>
			);
		return (
			<div className="user_actions">
				<h1>{modalProps.selectedUser.username}</h1>
				<a
					className="link"
					onClick={() =>
						modalProps.toggleModal(
							createChallengeAlert(modalProps.selectedUser, modalProps)
						)
					}
				>
					challenge
				</a>
				{renderFriendRequestActions(
					friends,
					modalProps,
					outgoingRequests,
					remove_friend,
					invite_friend
				)}
				{renderBlockOrUnblock(friends, modalProps)}
			</div>
		);
	};

	return (
		<div className="userStats">
			<div className="user">
				<div className="avatar_container">
					<img src={convertEncodedImage(modalProps.selectedUser.avatar.file)} />
				</div>
				{renderUserActions()}
			</div>
			<Stats userId={modalProps.selectedUser.id} />
			<MatchHistory userId={modalProps.selectedUser.id} />
			<Friends {...modalProps} selectedUser={modalProps.selectedUser} />
		</div>
	);
}

const INVITE_FRIEND = gql`
	mutation InviteFriend($friendId: String!) {
		inviteFriend(friend_id: $friendId)
	}
`;

const REMOVE_FRIEND = gql`
	mutation RemoveFriend($friendId: String!) {
		removeFriend(friend_id: $friendId)
	}
`;

function renderFriendRequestActions(
	friends: any,
	modalProps: any,
	outgoingRequests: any,
	remove_friend: any,
	invite_friend: any
) {
	if (outgoingRequests.find((request: any) => request.id === modalProps.selectedUser.id))
		return <>friend request has been sent</>;
	if (friends.find((friend: any) => friend.id === modalProps.selectedUser.id))
		return (
			<a
				className="link"
				onClick={() => {
					remove_friend({ variables: { friendId: modalProps.selectedUser.id } });
				}}
			>
				defriend {modalProps.selectedUser.username}
			</a>
		);
	return (
		<a
			className="link"
			onClick={() => {
				invite_friend({ variables: { friendId: modalProps.selectedUser.id } });
			}}
		>
			send friend request
		</a>
	);
}

// TODO: implement blockOrUnblock
function renderBlockOrUnblock(friends: any, modalProps: any) {
	return (
		<a
			className="link"
			onClick={() =>
				modalProps.toggleModal(createBlockAlert(modalProps.selectedUser, modalProps))
			}
		>
			block
		</a>
	);
}

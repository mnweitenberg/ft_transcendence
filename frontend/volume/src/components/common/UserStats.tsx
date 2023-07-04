import "../../styles/style.css";
import Stats from "./Stats";
import Friends from "./Friends";
import MatchHistory from "./MatchHistory";
import * as i from "../../types/Interfaces";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { useFriendsData } from "src/utils/useFriendsData";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useOutgoingRequests } from "src/utils/useOutgoingRequests";
import {
	useChallengeAvailability,
	useOwnChallengeAvailability,
} from "src/utils/useChallengeAvailability";

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
	const [challenge_friend, { loading: challenge_loading, error: challenge_error }] =
		useMutation(CHALLENGE_FRIEND);
	const {
		challengeAvailabilityStatus,
		loading: challenge_available_loading,
		error: challenge_available_error,
	} = useChallengeAvailability(modalProps.selectedUser.id);
	const {
		ownChallengeAvailabilityStatus,
		loading: own_challenge_available_loading,
		error: own_challenge_available_error,
	} = useOwnChallengeAvailability();

	if (challenge_available_loading) return <></>;
	if (own_challenge_available_loading) return <></>;
	if (loading) return <> </>;
	if (loadingOutgoing) return <div>Loading friends</div>;
	if (loadingRemove) return <> </>;
	if (loadingRequest) return <>send friend request</>;
	if (challenge_loading) return <>loading challenge</>;

	if (challenge_available_error) return <></>;
	if (own_challenge_available_error) return <></>;
	if (error) return <>Error friends</>;
	if (challenge_error) return <>challenge error</>;
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
				{renderChallengeFriendActions(
					friends,
					modalProps,
					challenge_friend,
					ownChallengeAvailabilityStatus.challengeStatus,
					challengeAvailabilityStatus.challengeStatus
				)}
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

export enum ChallengeStatus {
	CAN_CHALLENGE,
	IN_MATCH,
	IN_QUEUE,
	IS_CHALLENGER,
	OFFLINE,
}

const CHALLENGE_FRIEND = gql`
	mutation ChallengeFriend($friendId: String!) {
		challengeFriend(friendId: $friendId)
	}
`;

function renderChallengeFriendActions(
	friends: any,
	modalProps: any,
	challenge_friend: any,
	own_challenge_availability_data: ChallengeStatus,
	challenge_availability_data: ChallengeStatus
) {
	if (own_challenge_availability_data === ChallengeStatus.IN_QUEUE)
		return <>You cannot challenge other players, because you are in queue</>;
	if (own_challenge_availability_data === ChallengeStatus.IN_MATCH)
		return <>You cannot challenge other players, because you are in a match</>;
	if (own_challenge_availability_data === ChallengeStatus.IS_CHALLENGER)
		return (
			<>
				You cannot challenge other players, because you are already challenged another
				player
			</>
		);
	if (challenge_availability_data === ChallengeStatus.IN_QUEUE)
		return <>cannot challenge {modalProps.selectedUser.username} (in queue)</>;
	if (challenge_availability_data === ChallengeStatus.IN_MATCH)
		return <>cannot challenge {modalProps.selectedUser.username} (in match)</>;
	if (challenge_availability_data === ChallengeStatus.OFFLINE)
		return <>cannot challenge {modalProps.selectedUser.username} (offline)</>;
	if (challenge_availability_data === ChallengeStatus.IS_CHALLENGER)
		return <>cannot challenge {modalProps.selectedUser.username} </>;
	return (
		<a
			className="link"
			onClick={() => {
				challenge_friend({ variables: { friendId: modalProps.selectedUser.id } });
			}}
		>
			challenge
		</a>
	);
}

// TODO: implement blockOrUnblock
function renderBlockOrUnblock(friends: any, modalProps: any) {
	return <a className="link">block</a>;
}

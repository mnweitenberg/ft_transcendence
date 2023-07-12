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
import { useBlockState } from "src/utils/useBlockState";

export default function UserStats(modalProps: i.ModalProps & { selectedUser: any }) {
	const { friends, loading, error } = useFriendsData(modalProps.userId);
	const {
		outgoingRequests,
		loading: loadingOutgoing,
		error: errorOutgoing,
	} = useOutgoingRequests(modalProps.userId);
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

	const [remove_friend, { loading: loadingRemove, error: errorRemove }] =
		useMutation(REMOVE_FRIEND);
	const [invite_friend, { loading: loadingRequest, error: errorRequest }] =
		useMutation(INVITE_FRIEND);
	const [challenge_friend, { loading: challenge_loading, error: challenge_error }] =
		useMutation(CHALLENGE_FRIEND);

	const [block_user, { loading: block_loading, error: block_error }] = useMutation(BLOCK_USER);
	const [unblock_user, { loading: unblock_loading, error: unblock_error }] =
		useMutation(UNBLOCK_USER);
	const {
		block_state: blocked,
		loading: block_state_loading,
		error: block_state_error,
	} = useBlockState(modalProps.selectedUser.id);

	if (challenge_available_loading) return <></>;
	if (own_challenge_available_loading) return <></>;
	if (loading) return <> </>;
	if (loadingOutgoing) return <div>Loading friends</div>;
	if (loadingRemove) return <> </>;
	if (loadingRequest) return <>send friend request</>;
	if (challenge_loading) return <>loading challenge</>;
	if (block_loading) return <>loading block status</>;
	if (unblock_loading) return <>loading block status</>;
	if (block_state_loading) return <>loading block status</>;

	if (challenge_available_error) return <></>;
	if (own_challenge_available_error) return <></>;
	if (error) return <>Error friends</>;
	if (challenge_error) return <>challenge error</>;
	if (errorOutgoing) return <>error</>;
	if (errorRemove) return <>error</>;
	if (errorRequest) return <>error</>;
	if (block_error) return <>error blocking user</>;
	if (unblock_error) return <>error unblocking user</>;
	if (block_state_error) return <>error loading user's block status</>;

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
				{renderBlockOrUnblock(modalProps, blocked, block_user, unblock_user)}
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

// TODO: add timer voor timeout challenge
//
// const [counter, setCounter] = useState(CHALLENGE_TIME_OUT / 1000);

// useEffect(() => {
// 	counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
// }, [counter]);

// {counter}  <-- displays seconds
function renderChallengeFriendActions(
	modalProps: any,
	challenge_friend: any,
	own_challenge_availability_data: ChallengeStatus,
	challenge_availability_data: ChallengeStatus
) {
	if (own_challenge_availability_data === ChallengeStatus.IN_QUEUE)
		return <div>You cannot challenge other players, because you are in queue</div>;
	if (own_challenge_availability_data === ChallengeStatus.IN_MATCH)
		return <div>You cannot challenge other players, because you are in a match</div>;
	if (own_challenge_availability_data === ChallengeStatus.IS_CHALLENGER)
		return (
			<div>
				You cannot challenge other players, because you already challenged another player
			</div>
		);
	if (challenge_availability_data === ChallengeStatus.IN_QUEUE)
		return <div>cannot challenge {modalProps.selectedUser.username} (in queue)</div>;
	if (challenge_availability_data === ChallengeStatus.IN_MATCH)
		return <div>cannot challenge {modalProps.selectedUser.username} (in match)</div>;
	if (challenge_availability_data === ChallengeStatus.OFFLINE)
		return <div>cannot challenge {modalProps.selectedUser.username} (offline)</div>;
	if (challenge_availability_data === ChallengeStatus.IS_CHALLENGER)
		return <div>cannot challenge {modalProps.selectedUser.username} </div>;
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

const BLOCK_USER = gql`
	mutation BlockUser($username: String!) {
		block_user(username: $username)
	}
`;

const UNBLOCK_USER = gql`
	mutation UnblockUser($username: String!) {
		unblock_user(username: $username)
	}
`;

function renderBlockOrUnblock(
	modalProps: any,
	blocked: boolean,
	block_user: any,
	unblock_user: any
) {
	if (blocked) {
		return (
			<a
				className="link"
				onClick={() => {
					unblock_user({ variables: { username: modalProps.selectedUser.username } });
				}}
			>
				unblock
			</a>
		);
	} else {
		return (
			<a
				className="link"
				onClick={() => {
					block_user({ variables: { username: modalProps.selectedUser.username } });
				}}
			>
				block
			</a>
		);
	}
}

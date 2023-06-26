import "../../styles/style.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";
import { convertEncodedImage } from "src/utils/convertEncodedImage";

const ACCEPT_FRIEND = gql`
	mutation AcceptFriend($friendId: String!) {
		acceptFriend(friend_id: $friendId) {
			id
		}
	}
`;

const DENY_FRIEND = gql`
	mutation DenyFriend($friendId: String!) {
		denyFriend(friend_id: $friendId) {
			id
		}
	}
`;

const GET_FRIENDS = gql`
	query {
		getFriends {
			username
			id
			avatar {
				file
			}
		}
	}
`;

const GET_INCOMING_FRIEND_REQUEST = gql`
	query {
		getIncomingFriendRequest {
			username
			id
			avatar {
				file
			}
		}
	}
`;

const GET_OUTGOING_FRIEND_REQUEST = gql`
	query {
		getOutgoingFriendRequest {
			username
			id
			avatar {
				file
			}
		}
	}
`;

const REMOVE_FRIEND = gql`
	mutation RemoveFriend($friendId: String!) {
		removeFriend(friend_id: $friendId)
	}
`;

const IN_FRIEND_REQUEST_CHANGED = gql`
	subscription incomingFriendRequestChanged($user_id: String!) {
		incomingFriendRequestChanged(user_id: $user_id) {
			incoming_friend_requests {
				username
				id
				avatar {
					file
				}
			}
		}
	}
`;

const OUT_FRIEND_REQUEST_CHANGED = gql`
	subscription outgoingFriendRequestChanged($user_id: String!) {
		outgoingFriendRequestChanged(user_id: $user_id) {
			outgoing_friend_requests {
				username
				id
				avatar {
					file
				}
			}
		}
	}
`;

const FRIENDS_CHANGED = gql`
	subscription FriendsChanged($userId: String!) {
		friendsChanged(user_id: $userId) {
			username
			id
			avatar {
				file
			}
		}
	}
`;

function Friends(modalProps: i.ModalProps) {
	const { data, loading, error, subscribeToMore } = useQuery(GET_FRIENDS);

	useEffect(() => {
		return subscribeToMore({
			document: FRIENDS_CHANGED,
			variables: { userId: modalProps.userId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newFriends = subscriptionData.data.friendsChanged;
				return Object.assign({}, prev, {
					getFriends: newFriends,
				});
			},
		});
	}, []);

	if (loading) return <div>Loading friends</div>;
	if (error) return <div>Error friends</div>;
	// data.getFriends.sort((a: any, b: any) => a.username < b.username);
	return (
		<div className="stat_block">
			<h2>Friends</h2>
			<div className="friend_list">
				{data.getFriends.map(function (friend: any) {
					return (
						<div className="flex_col" key={friend.username}>
							<img
								src={convertEncodedImage(friend.avatar.file)}
								className="friend_list--avatar"
								onClick={() => {
									modalProps.toggleModal(
										<UserStats user={friend} modalProps={modalProps} />
									);
								}}
							/>
							{friend.username}
							{/* <FriendRemove friend_id={friend.id} /> */}
						</div>
					);
				})}
			</div>
			<div>
				<h3>Incoming friend requests</h3>
				<IncomingFriendRequests {...modalProps} />

				<h3>Outgoing friend requests</h3>
				<OutgoingFriendRequests {...modalProps} />
			</div>
		</div>
	);
}

function IncomingFriendRequests(modalProps: i.ModalProps) {
	const {
		data: incoming_friend_data,
		loading: incoming_friend_loading,
		error: incoming_friend_error,
		subscribeToMore,
	} = useQuery(GET_INCOMING_FRIEND_REQUEST);

	useEffect(() => {
		return subscribeToMore({
			document: IN_FRIEND_REQUEST_CHANGED,
			variables: { user_id: modalProps.userId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newRequests =
					subscriptionData.data.incomingFriendRequestChanged.incoming_friend_requests;
				return Object.assign({}, prev, {
					getIncomingFriendRequest: newRequests,
				});
			},
		});
	}, []);

	if (!incoming_friend_data) return <div> No incoming friend requests </div>;
	return (
		<div className="friend_list">
			{incoming_friend_data.getIncomingFriendRequest.map(function (incoming_friend_req: any) {
				// return (
				// 	<div className="flex_col">
				// 		<img
				// 			key={incoming_friend_req.username}
				// 			src={convertEncodedImage(incoming_friend_req.avatar.file)}
				// 			className="friend_list--avatar"
				// 			onClick={() => {
				// 				modalProps.toggleModal(
				// 					<UserStats
				// 						user={incoming_friend_req.user}
				// 						modalProps={modalProps}
				// 					/>
				// 				);
				// 			}}
				// 		/>
				// 		{incoming_friend_req.username}
				// 		{/* <FriendRemove friend_id={friend.id} /> */}
				// 	</div>
				// );
				return (
					<div key={incoming_friend_req.username}>
						<div className="flex_row_spacebetween">
							<img
								src={convertEncodedImage(incoming_friend_req.avatar.file)}
								className="friend_list--avatar"
								onClick={() => {
									modalProps.toggleModal(
										<UserStats
											user={incoming_friend_req}
											modalProps={modalProps}
										/>
									);
								}}
							/>
							<div className="flex_col">
								{incoming_friend_req.username}
								<FriendAccept friend_id={incoming_friend_req.id} />
								<FriendDeny friend_id={incoming_friend_req.id} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function FriendAccept({ friend_id }: { friend_id: string }) {
	const [
		accept_friend,
		{ data: accept_data, loading: accept_loading, error: accept_error, called: accept_called },
	] = useMutation(ACCEPT_FRIEND);

	if (accept_loading) return <>Loading accept</>;
	if (accept_error) return <>Error accept</>;
	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					accept_friend({ variables: { friendId: friend_id } });
				}}
			>
				<button type="submit">Accept</button>
			</form>
		</div>
	);
}

function FriendDeny({ friend_id }: { friend_id: string }) {
	const [
		deny_friend,
		{ data: accept_data, loading: accept_loading, error: accept_error, called: accept_called },
	] = useMutation(DENY_FRIEND);

	if (accept_loading) return <>Loading accept</>;
	if (accept_error) return <>Error accept</>;
	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					deny_friend({ variables: { friendId: friend_id } });
				}}
			>
				<button type="submit">Deny</button>
			</form>
		</div>
	);
}

function FriendRemove({ friend_id }: { friend_id: string }) {
	const [remove_friend, { data, loading, error }] = useMutation(REMOVE_FRIEND);

	if (loading) return <>Loading removal</>;
	if (error) return <>Remove error</>;
	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					remove_friend({ variables: { friendId: friend_id } });
				}}
			>
				<button type="submit">Remove friend</button>
			</form>
		</div>
	);
}

function OutgoingFriendRequests(modalProps: i.ModalProps) {
	const {
		data: outgoing_friend_data,
		loading: outgoing_friend_loading,
		error: outgoing_friend_error,
		subscribeToMore,
	} = useQuery(GET_OUTGOING_FRIEND_REQUEST);

	useEffect(() => {
		return subscribeToMore({
			document: OUT_FRIEND_REQUEST_CHANGED,
			variables: { user_id: modalProps.userId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newRequests =
					subscriptionData.data.outgoingFriendRequestChanged.outgoing_friend_requests;
				return Object.assign({}, prev, {
					getOutgoingFriendRequest: newRequests,
				});
			},
		});
	}, []);

	if (outgoing_friend_loading) return <div> Loading outgoing friend requests </div>;
	if (outgoing_friend_error) return <div> Outgoing friend requests error </div>;
	if (!outgoing_friend_data) return <div> No outgoing friend requests </div>;
	return (
		<div className="friend_list">
			{outgoing_friend_data.getOutgoingFriendRequest.map(function (outgoing_friend_req: any) {
				return (
					<div key={outgoing_friend_req.username + modalProps.userId}>
						{outgoing_friend_req.username}
					</div>
				);
			})}
		</div>
	);
}

export default Friends;

const INVITE_FRIEND = gql`
	mutation InviteFriend($friendId: String!) {
		inviteFriend(friend_id: $friendId)
	}
`;

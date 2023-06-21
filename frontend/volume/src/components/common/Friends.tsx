import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

const GET_FRIENDS = gql`
	query {
		getFriends {
			username
		}
	}
`;

const GET_INCOMING_FRIEND_REQUEST = gql`
	query {
		getIncomingFriendRequest {
			username
		}
	}
`;

const GET_OUTGOING_FRIEND_REQUEST = gql`
	query {
		getOutgoingFriendRequest {
			username
		}
	}
`;

const IN_FRIEND_REQUEST_CHANGED = gql`
	subscription incomingFriendRequestChanged($user_id: String!) {
		incomingFriendRequestChanged(user_id: $user_id) {
			incoming_friend_requests {
				username
			}
		}
	}
`;

const OUT_FRIEND_REQUEST_CHANGED = gql`
	subscription outgoingFriendRequestChanged($user_id: String!) {
		outgoingFriendRequestChanged(user_id: $user_id) {
			outgoing_friend_requests {
				username
			}
		}
	}
`;

function Friends({ userId }: { userId: string }) {
	const { data, loading, error } = useQuery(GET_FRIENDS);

	if (loading) {
		return <div>Loading friends</div>;
	}
	if (error) {
		return <div>Error friends</div>;
	}
	return (
		<div className="stat_block">
			<h2>Friends</h2>
			<div className="friend_list">
				{data.getFriends.map(function (friend: any) {
					return (
						<div key={friend.username}>
							<h4 className="name">{friend.username} </h4>
							{/* <img
								className="friend_list--avatar"
								onClick={() => props.toggleModal(friend, <UserStats {...props} />)}
								src={friend.avatar}
							/> */}
						</div>
					);
				})}
			</div>
			<div>
				<h3>Incoming friend requests</h3>
				<IncomingFriendRequests userId={userId} />

				<h3>Outgoing friend requests</h3>
				<OutgoingFriendRequests userId={userId} />
			</div>
		</div>
	);
}

function IncomingFriendRequests({ userId }: { userId: string }) {
	const {
		data: incoming_friend_data,
		loading: incoming_friend_loading,
		error: incoming_friend_error,
		subscribeToMore,
	} = useQuery(GET_INCOMING_FRIEND_REQUEST);
	// const { data: accept_data, loading: accept_loading, error: accept_error } = useMutation();

	useEffect(() => {
		return subscribeToMore({
			document: IN_FRIEND_REQUEST_CHANGED,
			variables: { user_id: userId },
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

	const acceptFriend = (event: any) => {
		event.preventDefault();
		// mutation acceptFriend
	};

	const denyFriend = (event: any) => {
		event.preventDefault();
		// mutation denyFriend
	};

	if (!incoming_friend_data) {
		return <div> No incoming friend requests </div>;
	} else {
		return (
			<div className="friend_list">
				{incoming_friend_data.getIncomingFriendRequest.map(function (
					incoming_friend_req: any
				) {
					return (
						<div key={incoming_friend_req.username}>
							{incoming_friend_req.username}
							<form onSubmit={acceptFriend}>
								<button type="submit">Accept</button>
							</form>
							<form onSubmit={denyFriend}>
								<button type="submit">Deny</button>
							</form>
						</div>
					);
				})}
			</div>
		);
	}
}

function OutgoingFriendRequests({ userId }: { userId: string }) {
	const {
		data: outgoing_friend_data,
		loading: outgoing_friend_loading,
		error: outgoing_friend_error,
		subscribeToMore,
	} = useQuery(GET_OUTGOING_FRIEND_REQUEST);

	useEffect(() => {
		return subscribeToMore({
			document: OUT_FRIEND_REQUEST_CHANGED,
			variables: { user_id: userId },
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

	if (outgoing_friend_loading) {
		return <div> Loading outgoing friend requests </div>;
	}
	if (outgoing_friend_error) {
		return <div> Outgoing friend requests error </div>;
	}
	if (!outgoing_friend_data) {
		return <div> No outgoing friend requests </div>;
	} else {
		return (
			<div className="friend_list">
				{outgoing_friend_data.getOutgoingFriendRequest.map(function (
					outgoing_friend_req: any
				) {
					return (
						<div key={outgoing_friend_req.username + userId}>
							{outgoing_friend_req.username}
						</div>
					);
				})}
			</div>
		);
	}
}

export default Friends;

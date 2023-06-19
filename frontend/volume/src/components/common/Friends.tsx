import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";
import { gql, useQuery } from "@apollo/client";

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

/*
	

*/
function Friends({ userId }: { userId: string }) {
	const { data, loading, error } = useQuery(GET_FRIENDS);

	// const {
	// 	data: outgoing_friend_data,
	// 	loading: outgoing_friend_loading,
	// 	error: outgoing_friend_error,
	// } = useQuery(GET_OUTGOING_FRIEND_REQUEST);

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
				<h3>Friend requests</h3>
				Incoming
				<IncomingFriendRequests />
			</div>
			Outgoing
		</div>
	);
}

function IncomingFriendRequests() {
	const {
		data: incoming_friend_data,
		loading: incoming_friend_loading,
		error: incoming_friend_error,
	} = useQuery(GET_INCOMING_FRIEND_REQUEST);

	if (incoming_friend_loading) {
		return <div> Loading incoming friend requests </div>;
	}
	if (incoming_friend_error) {
		return <div> Incoming friend requests error </div>;
	}

	if (!incoming_friend_data) {
		return <div> No incoming friend requests </div>;
	} else {
		return (
			<div className="friend_list">
				{incoming_friend_data.getIncomingFriendRequest.map(function (
					incoming_friend_req: any
				) {
					return (
						<div key={incoming_friend_req.username}>{incoming_friend_req.username}</div>
					);
				})}
			</div>
		);
	}
}

export default Friends;

import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { useFriendsData } from "src/utils/useFriendsData";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import FriendRequestAlert from "./FriendRequestAlert";

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

function Friends(modalProps: i.ModalProps & { selectedUser: any }) {
	const { friends, loading, error } = useFriendsData(modalProps.selectedUser.id);

	if (loading) return <div>Loading friends</div>;
	if (error) return <div>Error friends</div>;
	if (!friends) return <div>No friends</div>;
	return (
		<div className="stat_block">
			<h2>Friends</h2>
			<div className="friend_list">
				{friends.map(function (friend: any) {
					return (
						<div className="flex_col" key={friend.username}>
							<div className="friends_avatar_container">
								<img
									src={convertEncodedImage(friend.avatar.file)}
									onClick={() => {
										modalProps.toggleModal(
											<UserStats {...modalProps} selectedUser={friend} />
										);
									}}
								/>
							</div>
							{/* {friend.username} */}
						</div>
					);
				})}
			</div>
			<IncomingFriendRequests {...modalProps} />
		</div>
	);
}

export default Friends;

function IncomingFriendRequests(modalProps: i.ModalProps) {
	const { data, loading, error, subscribeToMore } = useQuery(GET_INCOMING_FRIEND_REQUEST);

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

	if (!error && !loading && data && data.getIncomingFriendRequest.length > 0)
		return <FriendRequestAlert user={data.getIncomingFriendRequest[0]} />;
	return <></>;
}

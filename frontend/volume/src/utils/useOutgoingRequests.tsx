import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_OUTGOING_FRIEND_REQUEST = gql`
	query getOutgoingFriendRequest {
		getOutgoingFriendRequest {
			username
			id
			avatar {
				file
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

export const useOutgoingRequests = (userId: any) => {
	const { data, loading, error, subscribeToMore } = useQuery(GET_OUTGOING_FRIEND_REQUEST, {
		variables: { user_id: userId },
	});

	useEffect(() => {
		return subscribeToMore({
			document: OUT_FRIEND_REQUEST_CHANGED,
			variables: { user_id: userId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newRequests = subscriptionData.data.outgoingFriendRequestChanged;
				return Object.assign({}, prev, {
					getOutgoingFriendRequest: newRequests,
				});
			},
		});
	}, []);

	return { outgoingRequests: data?.getOutgoingFriendRequest, loading, error };
};

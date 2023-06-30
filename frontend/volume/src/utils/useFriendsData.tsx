import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_FRIENDS = gql`
	query getFriends($userId: String!) {
		getFriends(user_id: $userId) {
			username
			id
			avatar {
				file
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

export const useFriendsData = (userId: any) => {
	const { data, loading, error, subscribeToMore } = useQuery(GET_FRIENDS, {
		variables: { userId },
	});

	useEffect(() => {
		return subscribeToMore({
			document: FRIENDS_CHANGED,
			variables: { userId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newFriends = subscriptionData.data.friendsChanged;
				return Object.assign({}, prev, {
					getFriends: newFriends,
				});
			},
		});
	}, []);

	return { friends: data?.getFriends, loading, error };
};

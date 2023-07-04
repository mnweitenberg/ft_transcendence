import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const CHALLENGE_AVAILABILITY_CHANGED = gql`
	subscription ChallengeAvailabilityChanged($friendId: String!) {
		challengeAvailabilityChanged(friend_id: $friendId) {
			challengeStatus
		}
	}
`;

const GET_CHALLENGE_AVAILABILITY = gql`
	query GetChallengeAvailability($friendId: String!) {
		getChallengeAvailability(friendId: $friendId) {
			challengeStatus
		}
	}
`;

const GET_OWN_CHALLENGE_AVAILABILITY = gql`
	query GetOwnChallengeAvailability {
		getOwnChallengeAvailability {
			challengeStatus
		}
	}
`;

const OWN_CHALLENGE_AVAILABILITY_CHANGED = gql`
	subscription OwnChallengeAvailabilityChanged {
		ownChallengeAvailabilityChanged {
			challengeStatus
		}
	}
`;

export const useChallengeAvailability = (friendId: any) => {
	const { data, loading, error, subscribeToMore } = useQuery(GET_CHALLENGE_AVAILABILITY, {
		variables: { friendId: friendId },
	});

	useEffect(() => {
		return subscribeToMore({
			document: CHALLENGE_AVAILABILITY_CHANGED,
			variables: { friendId: friendId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const availabilityChanged = subscriptionData.data.challengeAvailabilityChanged;
				return Object.assign({}, prev, {
					getChallengeAvailability: availabilityChanged,
				});
			},
		});
	}, []);

	return { challengeAvailabilityStatus: data?.getChallengeAvailability, loading, error };
};

export const useOwnChallengeAvailability = () => {
	const { data, loading, error, subscribeToMore } = useQuery(GET_OWN_CHALLENGE_AVAILABILITY);

	useEffect(() => {
		return subscribeToMore({
			document: OWN_CHALLENGE_AVAILABILITY_CHANGED,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const availabilityChanged = subscriptionData.data.ownChallengeAvailabilityChanged;
				return Object.assign({}, prev, {
					getOwnChallengeAvailability: availabilityChanged,
				});
			},
		});
	}, []);

	return { ownChallengeAvailabilityStatus: data?.getOwnChallengeAvailability, loading, error };
};

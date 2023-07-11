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
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		return subscribeToMore({
			document: CHALLENGE_AVAILABILITY_CHANGED,
			variables: { friendId: friendId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					getChallengeAvailability: subscriptionData.data.challengeAvailabilityChanged,
				};
			},
		});
	}, []);

	return { challengeAvailabilityStatus: data?.getChallengeAvailability, loading, error };
};

export const useOwnChallengeAvailability = () => {
	const { data, loading, error, subscribeToMore } = useQuery(GET_OWN_CHALLENGE_AVAILABILITY, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		return subscribeToMore({
			document: OWN_CHALLENGE_AVAILABILITY_CHANGED,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					getOwnChallengeAvailability:
						subscriptionData.data.ownChallengeAvailabilityChanged,
				};
			},
		});
	}, []);

	return {
		ownChallengeAvailabilityStatus: data?.getOwnChallengeAvailability,
		loading,
		error,
	};
};

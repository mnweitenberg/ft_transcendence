import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

const BLOCK_STATE = gql`
	query BlockState($user_id: String!) {
		is_user_blocked(user_id: $user_id)
	}
`;

const BLOCK_STATE_CHANGED = gql`
	subscription BlockStateChanged($user_id: String!) {
		block_state_changed(user_id: $user_id)
	}
`;

export function useBlockState(user_id: string) {
	const { data, loading, error, subscribeToMore } = useQuery(BLOCK_STATE, {
		variables: { user_id },
	});
	useEffect(() => {
		return subscribeToMore({
			document: BLOCK_STATE_CHANGED,
			variables: { user_id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const block_state_changed = subscriptionData.data.block_state_changed;
				return Object.assign({}, prev, {
					is_user_blocked: block_state_changed,
				});
			},
		});
	}, []);

	return { block_state: data?.is_user_blocked, loading, error };
}

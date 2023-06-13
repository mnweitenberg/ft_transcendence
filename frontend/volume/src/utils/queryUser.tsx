import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const USER = gql`
	query userQuery($userId: String!) {
		userQuery(userId: $userId) {
			username
			avatar {
				file
			}
			id
			ranking {
				rank
				wins
				losses
				score
			}
		}
	}
`;

const CURRENT_USER = gql`
	query currentUserQuery {
		currentUserQuery {
			username
			avatar {
				file
			}
			id
		}
	}
`;

export function queryUser(userId: string) {
	const [user, setUser] = useState([]);
	const { data, loading, error } = useQuery(USER, { variables: { userId } });

	useEffect(() => {
		if (data) setUser(data.userQuery);
	}, [data]);

	return { user, loading, error };
}

export function queryCurrentUser() {
	const { loading, error, data } = useQuery(CURRENT_USER);

	if (loading) return "loading";
	if (error) return "error";

	return data.currentUserQuery;
}

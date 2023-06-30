import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import * as i from "../types/Interfaces";

const USER = gql`
	query userQuery($userId: String!) {
		userQuery(userId: $userId) {
			username
			avatar {
				file
			}
			id
		}
	}
`;

export function useQueryUser(userId: string): {
	user: i.User | null;
	loading: boolean;
	error: any;
} {
	const [user, setUser] = useState<i.User | null>(null);
	const { data, loading, error } = useQuery(USER, { variables: { userId } });

	useEffect(() => {
		if (data) setUser(data.userQuery);
	}, [data]);

	return { user, loading, error };
}

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

export function useQueryCurrentUser() {
	const { loading, error, data } = useQuery(CURRENT_USER);

	if (loading) return "loading";
	if (error) return "error";

	return data.currentUserQuery;
}

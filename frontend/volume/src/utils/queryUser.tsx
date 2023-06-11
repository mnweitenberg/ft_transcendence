import { gql, useQuery } from "@apollo/client";

const USER = gql`
	query currentUserQuery {
		currentUserQuery {
			username
		}
	}
`;

export function queryUsername() {
	const { loading, error, data } = useQuery(USER);

	if (loading) return "loading";
	if (error) return "error";

	return data.currentUserQuery.username;
}

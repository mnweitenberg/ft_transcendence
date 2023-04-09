import { GraphQLClient, gql } from "graphql-request";
import { useQuery } from "react-query";

export const graphQLClient = new GraphQLClient(import.meta.env.BACKEND_URL);

const CLIENT_UID_QUERY = gql`
	query clientUidQuery {}
`;

interface ClientUidQueryData {
	clientUid: string;
}

export function useClientUidQuery() {
	return useQuery("get-uid", async () => {
		const clientUid: string = await graphQLClient.request(CLIENT_UID_QUERY);
		return clientUid;
	});
}

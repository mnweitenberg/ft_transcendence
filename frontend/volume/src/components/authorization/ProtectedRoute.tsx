import { gql, useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

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

function ProtectedRoute({ children }: { children: any }): JSX.Element {
	const { loading, error, data } = useQuery(CURRENT_USER);

	if (loading) return <Loading />;
	if (error && error.message == "Unauthorized") return <Navigate to="/login" replace />;
	else if (error) return <>Error</>;

	return children;
}
export default ProtectedRoute;

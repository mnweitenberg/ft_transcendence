import { gql, useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

const LOGIN_QUERY = gql`
	query loginQuery {
		loginQuery
	}
`;

function ProtectedRoute({ children }: { children: any }): JSX.Element {
	const { loading, error, data } = useQuery(LOGIN_QUERY);

	if (loading) return <Loading />;

	if (!data.loginQuery) {
		return <Navigate to="/login" replace />;
	}
	return children;
}
export default ProtectedRoute;

import { useEffect, useState } from "react";
import { ApolloQueryResult, gql, useQuery } from "@apollo/client";

const VALIDATE_COOKIE_QUERY = gql`
	query validateCookieQuery {
		validateCookieQuery
	}
`;

// function useLogin(): { queryError: boolean; loggedIn: boolean } {
// 	const { loading, error, data } = useQuery(VALIDATE_COOKIE_QUERY);

// 	return null;
// }

// function useLogin(): { queryError: boolean; loggedIn: boolean } {
// 	const { loading, error, data } = useQuery(VALIDATE_COOKIE_QUERY);
// 	const [queryError, setQueryError] = useState(false);

// 	useEffect(() => {
// 		function handleLogin() {
// 			setLogin(true);
// 		}
// 		function handleNotLogin() {
// 			setLogin(false);
// 		}
// 	}, [loading]);
// 	if (error) return [true, data];

// }

// function useLogin(): {
// 	// error: boolean;
// 	// loading: boolean;
// 	// loggedIn: boolean;
// 	// login(): void;
// 	// logout(): void;
// } {

// }

// interface IuseLogin {
// 	error: boolean;
// 	loading: boolean;
// 	loggedIn: boolean;
// 	login(): void;
// 	logout(): void;
// }

// function useLogin(): { output: IuseLogin } {
// 	const { loading, error, data } = useQuery(VALIDATE_COOKIE_QUERY);

// 	return null;
// }

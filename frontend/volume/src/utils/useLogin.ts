import { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const LOGIN_QUERY = gql`
	query loginQuery {
		loginQuery
	}
`;

export function useLogin() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [getLoginStatus, { loading, error, data }] = useLazyQuery(LOGIN_QUERY);

	useEffect(() => {
		const checkLogin = async () => {
			await getLoginStatus();
		};
		function handleLoggedIn() {
			setIsLoggedIn(true);
		}
		function handleLoggedOut() {
			setIsLoggedIn(false);
		}
		checkLogin();
		console.log(data.loginQuery);
		if (data.loginQuery == true) handleLoggedIn();
		else handleLoggedOut();
	}, []);
	return isLoggedIn;
}

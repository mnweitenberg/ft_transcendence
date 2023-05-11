import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "src/styles/style.css";
import Welcome from "./components/login/Welcome";
import Auth from "src/components/login/Auth";
import Home from "src/components/Home";
import { gql, useQuery } from "@apollo/client";
import { useLogin } from "./utils/useLogin";
import { useLazyQuery } from "@apollo/client";

// const VALIDATE_COOKIE_QUERY = gql`
// 	query validateCookieQuery {
// 		validateCookieQuery
// 	}
// `;

const LOGIN_QUERY = gql`
	query loginQuery {
		loginQuery
	}
`;

async function getLoginStatus(): Promise<boolean> {
	const [loginStatusQuery, { loading, error, data }] = useLazyQuery(LOGIN_QUERY);
	await loginStatusQuery();
	return data.loginQuery;
}

function App() {
	// const [loggedIn, setLoggedIn] = useState(false);
	// const location = useLocation();
	// const navigate = useNavigate();

	// const handleLogin = async () => {
	// 	const loginStatus = await getLoginStatus();
	// 	console.log(loginStatus);
	// 	setLoggedIn(loginStatus);
	// };
	// useEffect(() => {
	// 	if (!loggedIn && location.pathname == "/") navigate("/login");
	// 	if (loggedIn && location.pathname == "/login") navigate("/");
	// }, [loggedIn]);
	return (
		<>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/login" element={<Auth />} />
				<Route path="/home" element={<Home />} />
			</Routes>
		</>
	);
}
export default App;

// function App() {
// 	// LOGGING IN
// 	const { loading, error, data } = useQuery(VALIDATE_COOKIE_QUERY);
// 	const [loggedIn, setLoginState] = useState(false);
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	function setLogin() {
// 		setLoginState(!loggedIn);
// 	}
// 	useEffect(() => {
// 		console.log("dada");
// 		if (!loading && data.validateCookieQuery) {
// 			console.log(data.validateCookieQuery);
// 			setLogin();
// 		}
// 	}, [loading]);
// 	useEffect(() => {
// 		if (!loggedIn && location.pathname == "/") {
// 			navigate("/login");
// 		}
// 		if (loggedIn && location.pathname != "/") {
// 			navigate("/");
// 		}
// 	}, [loggedIn]);
// 	return (
// 		<>
// 			<Routes>
// 				<Route path="/" element={<Home />} />
// 				<Route path="/login" element={<Auth />} />
// 			</Routes>
// 		</>
// 	);
// }
// export default App;

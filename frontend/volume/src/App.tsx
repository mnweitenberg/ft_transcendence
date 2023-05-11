import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "src/styles/style.css";
import Auth from "src/components/login/Auth";
import Loading from "src/components/login/Loading";
import Home from "src/components/Home";
import { gql, useQuery } from "@apollo/client";

const VALIDATE_COOKIE_QUERY = gql`
	query validateCookieQuery {
		validateCookieQuery
	}
`;

function App() {
	// LOGGING IN
	const { loading, error, data } = useQuery(VALIDATE_COOKIE_QUERY);
	const [loggedIn, setLoginState] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	function setLogin() {
		setLoginState(!loggedIn);
	}
	useEffect(() => {
		console.log("dada");
		if (!loading && data.validateCookieQuery) {
			console.log(data.validateCookieQuery);
			setLogin();
		}
	}, [loading]);
	useEffect(() => {
		if (!loggedIn && location.pathname == "/") {
			navigate("/login");
		}
		if (loggedIn && location.pathname != "/") {
			navigate("/");
		}
	}, [loggedIn]);
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Auth />} />
				<Route path="/loading" element={<Loading />} />
			</Routes>
		</>
	);
}
export default App;

// function App() {
// 	// LOGGING IN
// 	const [login, setLogin] = useState(false);
// 	function LogIn() {
// 		setLogin(!login);
// 	}

// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	useEffect(() => {
// 		if (!login && location.pathname == "/") {
// 			navigate("/login");
// 		}
// 	}, [login]);
// 	return (
// 		<>
// 			<Routes>
// 				<Route path="/" element={<Home LogIn={LogIn} />} />
// 				<Route path="/login" element={<Auth />} />
// 			</Routes>
// 		</>
// 	);
// }
// export default App;

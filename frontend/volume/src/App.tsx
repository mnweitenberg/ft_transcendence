import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "src/styles/style.css";
import Auth from "src/components/login/Auth";
import Home from "src/components/Home";

function sessionCookie(): boolean {}

function App() {
	// LOGGING IN
	const [login, setLogin] = useState(false);
	function LogIn() {
		setLogin(!login);
	}

	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		if (!login && location.pathname == "/") {
			navigate("/login");
		}
	});
	return (
		<>
			<Routes>
				<Route path="/" element={<Home LogIn={LogIn} />} />
				<Route path="/login" element={<Auth />} />
			</Routes>
		</>
	);
}
export default App;

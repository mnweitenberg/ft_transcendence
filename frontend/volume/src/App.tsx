import { useState, useEffect } from "react";
import { ReactDOM } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "src/styles/style.css";
import Auth from "src/components/login/Auth";
import Loading from "src/components/login/Loading";
import Home from "src/components/Home";

function App() {
	// LOGGING IN
	const [login, setLogin] = useState(false);
	function LogIn() {
		setLogin(!login);
	}

	const navigate = useNavigate();
	if (!login) navigate("/login");

	return (
		<>
			<Routes>
				<Route path="/" element={<Home LogIn={LogIn} />} />
				<Route path="login" element={<Auth />} />
				<Route path="/loading" element={<Loading LogIn={LogIn} />} />
			</Routes>
		</>
	);
}
export default App;

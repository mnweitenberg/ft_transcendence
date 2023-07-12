import { Route, Routes } from "react-router-dom";
import "src/styles/style.css";
import ProtectedRoute from "./components/authorization/ProtectedRoute";
import Welcome from "./components/login/Welcome";
import Auth from "src/components/login/Auth";
import TwoFactor from "./components/login/TwoFactor";
import Home from "src/components/Home";
import { AuthProvider } from "./utils/authLogic";

function App() {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Welcome />} />
					<Route path="/login" element={<Auth />} />
					<Route path="/2fa" element={<TwoFactor />} />
					<Route
						path="/home"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</>
	);
}
export default App;

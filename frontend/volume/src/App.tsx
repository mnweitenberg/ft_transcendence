import { Route, Routes } from "react-router-dom";
import "src/styles/style.css";
import ProtectedRoute from "./components/authorization/ProtectedRoute";
import Welcome from "./components/login/Welcome";
import Auth from "src/components/login/Auth";
import Home from "src/components/Home";
import Lobby from "./components/Lobby";
import Leaderboard from "./components/Leaderboard";
import Settings from "./components/Settings";
import Layout from "./components/common/Layout";
import { AuthProvider } from "./utils/authLogic";

function App() {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Welcome />} />
					<Route path="/login" element={<Auth />} />
					<Route
						path="/home"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/lobby"
						element={
							<ProtectedRoute>
								<Lobby />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/leaderboard"
						element={
							<ProtectedRoute>
								<Layout>
									<Leaderboard />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</>
	);
}
export default App;

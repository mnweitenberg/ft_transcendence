import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Loading from "../authorization/Loading";
import "src/styles/login-pages/welcome.css";

const GREETING = gql`
	query currentUserQuery {
		currentUserQuery {
			username
		}
	}
`;

function Welcome(): JSX.Element {
	const { loading, error, data } = useQuery(GREETING);
	let username;

	if (loading) return <Loading />;
	if (error && error.message != "Unauthorized") return <div>{error.message}</div>;
	else if (error) {
		console.log(error.message);
		username = "unavailable";
	} else username = data.currentUserQuery.username;

	return (
		<div className="div-1">
			<div className="div-2">PONG</div>
			Hello {username}
			<Link to={"/home"}>
				<span className="play-button">PLAY</span>
			</Link>
		</div>
	);
}
export default Welcome;

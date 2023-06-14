import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Loading from "../authorization/Loading";
import "src/styles/login-pages/welcome.css";

function Welcome(): JSX.Element {
	return (
		<div className="div-1">
			<div className="div-2">PONG</div>
			<Link to={"/home"}>
				<span className="play-button">PLAY</span>
			</Link>
		</div>
	);
}
export default Welcome;

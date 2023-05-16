import { Link } from "react-router-dom";
import "src/styles/welcome.css";

function Welcome(): JSX.Element {
	return (
		<div className="div-1">
			<div className="div-2">PONG</div>
			<div className="play-button">
				<Link to={"/home"}>PLAY</Link>
			</div>
		</div>
	);
}
export default Welcome;

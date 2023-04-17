import { Link, useNavigate } from "react-router-dom";
import "src/styles/style.css";

function Loading({ LogIn }: { LogIn(): void }) {
	return (
		<div id="auth">
			<Link to="/">
				<div onClick={LogIn} className="signin">
					loading...
					<img className="logo42" src="/img/42logo.svg" />
				</div>
			</Link>
		</div>
	);
}
export default Loading;

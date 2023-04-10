import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "src/styles/style.css";

function Loading() {
	const navigate = useNavigate();
	const toHomePage = () => {
		useEffect(() => {
			navigate("/");
		});
	};
	return (
		<div id="loading">
			<div onClick={toHomePage} className="login">
				loading...
				<img className="logo42" src="/img/42logo.svg" />
			</div>
		</div>
	);
}
export default Loading;

// function Loading({ LogIn }: { LogIn(): void }) {
// 	return (
// 		<div id="loading">
// 			<div onClick={LogIn} className="login">
// 				loading...
// 				<img className="logo42" src="/img/42logo.svg" />
// 			</div>
// 		</div>
// 	);
// }
// export default Loading;

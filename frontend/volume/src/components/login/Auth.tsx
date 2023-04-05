// import "..//styles/style.css";
import "src/styles/style.css";

function Auth() {
	const url;
	return (
		<div id="auth">
			<div onClick={() => window.location.replace(url)} className="signin">
				sign in with
				<img className="logo42" src="/img/42logo.svg" />
			</div>
		</div>
	);
}
export default Auth;

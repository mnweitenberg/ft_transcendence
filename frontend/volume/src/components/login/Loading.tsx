import "src/styles/style.css";

function Loading({ LogIn }: { LogIn(): void }) {
	return (
		<div id="auth">
			<div onClick={LogIn} className="signin">
				loading...
				<img className="logo42" src="/img/42logo.svg" />
			</div>
		</div>
	);
}
export default Loading;

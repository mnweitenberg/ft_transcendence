import "../styles/style.css";

export default function Auth({ LogIn }: { LogIn(): void }) {
	return (
		<div id="auth">
			<div onClick={LogIn} className="signin">
				sign in with
				<img className="logo42" src="/img/42logo.svg" />
			</div>
		</div>
	);
}

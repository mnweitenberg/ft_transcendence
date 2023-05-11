import "src/styles/style.css";

function dec2hex(dec: any) {
	return dec.toString(16).padStart(2, "0");
}

function generateState(): string {
	const arr = new Uint8Array(10);
	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec2hex).join("");
}

function Auth() {
	const url =
		"https://api.intra.42.fr/oauth/authorize" +
		"?client_id=" +
		import.meta.env.VITE_CLIENT_UID +
		"&redirect_uri=" +
		encodeURIComponent("http://localhost:4242/callback") +
		"&state=" +
		generateState() +
		"&response_type=code";
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

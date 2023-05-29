import "src/styles/style.css";
import { env } from "src/utils/constants";

function generateState(): string {
	const arr = new Uint8Array(10);
	const dec2hex = (dec: any) => {
		return dec.toString(16).padStart(2, "0");
	};

	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec2hex).join("");
}

function Auth() {
	const url =
		"https://api.intra.42.fr/oauth/authorize" +
		"?client_id=" +
		import.meta.env.VITE_CLIENT_UID +
		"&redirect_uri=" +
		encodeURIComponent(`https://${env.VITE_DOMAIN}:4242/callback`) +
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

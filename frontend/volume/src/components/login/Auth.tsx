import "src/styles/style.css";
import { gql, useQuery } from "@apollo/client";

const GET_CLIENT_UID = gql`
	query clientUidQuery {
		clientUidQuery
	}
`;
function dec2hex(dec: any) {
	return dec.toString(16).padStart(2, "0");
}

function generateState(): string {
	const arr = new Uint8Array(10);
	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec2hex).join("");
}

function Auth() {
	const { loading, error, data } = useQuery(GET_CLIENT_UID);
	if (error) return <h1>Something went wrong!</h1>;
	if (loading) return <h1>Loading...</h1>;

	const url =
		"https://api.intra.42.fr/oauth/authorize" +
		"?client_id=" +
		data.clientUidQuery +
		"&redirect_uri=" +
		encodeURIComponent("http://localhost:5574/loading") +
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

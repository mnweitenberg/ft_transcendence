import "src/styles/style.css";
import { useClientUidQuery } from "src/utils/api";

function Auth() {
	const { data, error, isLoading } = useClientUidQuery();
	const url =
		"https://api.intra.42.fr/oauth/authorize" +
		"?client_id=" +
		data +
		"&redirect_uri=" +
		"http://localhost:5574/loading";

	if (error) return <h1>Something went wrong!</h1>;
	if (isLoading) return <h1>Loading...</h1>;
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

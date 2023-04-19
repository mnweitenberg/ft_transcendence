import { Link, useSearchParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import "src/styles/style.css";

const SEND_CODE = gql`
	mutation sendCodeMutation($codeStr: String!) {
		sendCodeMutation(code: $codeStr)
	}
`;

function Loading({ LogIn }: { LogIn(): void }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const codeStr = searchParams.get("code");
	const [sendCode, { loading, error, data }] = useMutation(SEND_CODE, {
		variables: { codeStr },
	});

	if (error) return <h1>Something went wrong!</h1>;
	if (loading) return <h1>Loading...</h1>;
	sendCode();

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

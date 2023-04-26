import { Link, useSearchParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import "src/styles/style.css";

const SEND_CODE = gql`
	mutation sessionTokenMutation($codeStr: String!) {
		sessionTokenMutation(code: $codeStr)
	}
`;

// function queryAndSaveToken(sendCode: () => any): void {}

function Loading({ LogIn }: { LogIn(): void }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const codeStr = searchParams.get("code");
	const [sendCode, { data, loading, error }] = useMutation(SEND_CODE, {
		onCompleted: (data) => {
			console.log(data);
		},
	});
	useEffect(() => {
		sendCode({ variables: { codeStr } });
	}, []);

	if (error) return <h1>Something went wrong!</h1>;
	if (loading) return <h1>Loading...</h1>;
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

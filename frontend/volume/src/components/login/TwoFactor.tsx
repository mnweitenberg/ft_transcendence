import { gql, useQuery } from "@apollo/client";
import "src/styles/style.css";

const USER_QUERY = gql`
	query currentUserQuery {
		currentUserQuery {
			id
			username
			avatar {
				file
				filename
			}
		}
	}
`;

function TwoFactor(): JSX.Element {
	const { loading, error, data } = useQuery(USER_QUERY);

	if (error) {
		console.log(error);
		return <>error</>;
	}
	if (loading) return <>loading</>;

	return (
		<div className="background">
			<div className="white_block">
				<div className="settings_content">hello world</div>
			</div>
		</div>
	);
}
export default TwoFactor;

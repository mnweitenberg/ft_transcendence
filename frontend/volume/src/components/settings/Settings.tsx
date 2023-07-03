import { gql, useQuery } from "@apollo/client";
import UserProfileSettings from "./UserProfileSettings";
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

function Settings(): JSX.Element {
	const { loading, error, data } = useQuery(USER_QUERY);

	if (error) {
		console.log(error);
		return <>error</>;
	}
	if (loading) return <>loading</>;

	return (
		<div className="background">
			<div className="white_block">
				<div className="settings_content">
					<UserProfileSettings userdata={data.currentUserQuery} />
				</div>
			</div>
		</div>
	);
}
export default Settings;

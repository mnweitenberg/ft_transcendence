import { gql, useQuery } from "@apollo/client";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import UserProfileSettings from "./settings/UserProfileSettings";
import "src/styles/style.css";
import { Link } from "react-router-dom";

const USER_QUERY = gql`
	query currentUserQuery {
		currentUserQuery {
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
			<div className="content_block">
				<h1>
					<Link to="/home">&lt; Home</Link>
				</h1>
				<UserProfileSettings userdata={data.currentUserQuery} />
			</div>
		</div>
	);
}
export default Settings;

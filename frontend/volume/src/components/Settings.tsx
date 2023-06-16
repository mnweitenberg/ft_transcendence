import { gql, useQuery } from "@apollo/client";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import Layout from "src/components/common/Layout";
import UserProfileSettings from "./settings/UserProfileSettings";

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
		<Layout>
			<UserProfileSettings userdata={data.currentUserQuery} />
		</Layout>
	);
}
export default Settings;

import { gql, useQuery } from "@apollo/client";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import Layout from "./common/Layout";

const AVATAR_QUERY = gql`
	query currentUserQuery {
		currentUserQuery {
			avatar {
				file
				filename
			}
		}
	}
`;

function Settings(): JSX.Element {
	const { loading, error, data } = useQuery(AVATAR_QUERY);

	if (error) {
		console.log(error);
		return <>error</>;
	}
	if (loading) return <>loading</>;

	return (
		<Layout>
			// this is the settings page // <br />
			// <img src={convertEncodedImage(data.currentUserQuery.avatar)} alt="error no image" />
			<form method="post" onSubmit={handleSubmit}>
				<label htmlFor="name">
					Username
					<input type="text" name="username" onChange={handleChange} />
				</label>
				<label htmlFor="Profile Picture">
					Profile Picture
					<input type="file" name="profilePicture" onChange={handleFileChange} />
				</label>
				<button type="submit">Confirm Profile</button>
			</form>
		</Layout>
	);
}
export default Settings;

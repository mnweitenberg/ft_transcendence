import { User } from "src/types/Interfaces";
import { convertEncodedImage } from "src/utils/convertEncodedImage";

function UserProfileSettings({ userdata }): JSX.Element {
	return (
		<div className="UserProfileSettings">
			<header>
				<h1>Profile Information</h1>
			</header>
			ch
			<div>
				<img src={convertEncodedImage(userdata.avatar.file)} alt="error no image" />
			</div>
		</div>
	);
}
export default UserProfileSettings;

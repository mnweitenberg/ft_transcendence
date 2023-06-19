import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import "src/styles/style.css";

const FORM_MUTATION = gql`
	mutation changeUserData($input: ChangeUserDataInput!) {
		changeUserData(changeUserData: $input) {
			username
			avatar {
				file
				filename
			}
		}
	}
`;

interface PictureForm {
	name: string;
	data: string;
}

function UserProfileSettings({ userdata }): JSX.Element {
	const [formMutation, { loading, error, data }] = useMutation(FORM_MUTATION);
	const [picture, setPicture] = useState<PictureForm>({ name: "", data: "" });
	const [usernameInput, setUsernameInput] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const username = event.currentTarget.username.value;
		const formData = {
			username: usernameInput,
			avatar: {
				file: picture.data,
				filename: picture.name,
			},
		};
		formMutation({
			variables: {
				input: formData,
			},
		});
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsernameInput(event.currentTarget.value);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) throw new Error();
		const fileReader = new FileReader();
		const file = event.target.files[0];
		const fileName = file.name;

		fileReader.onloadend = (e: any) => {
			const fileContent = e.currentTarget.result as string;
			console.log(fileContent);
			const imgData = window.btoa(fileContent);
			setPicture({ name: fileName, data: imgData });
		};
		fileReader.readAsBinaryString(file);
	};
	return (
		<div className="UserProfileSettings">
			<header>
				<h1>Profile Information</h1>
			</header>
			<div>
				<form method="post" onSubmit={handleSubmit}>
					<label htmlFor="name">
						Username
						<input type="text" name="username" onChange={handleChange} />
					</label>
					<img
						className="profile-settings"
						src={convertEncodedImage(userdata.avatar.file)}
						alt="error no image"
					/>{" "}
					<br />
					<label htmlFor="Profile Picture">
						Profile Picture
						<input type="file" name="profilePicture" onChange={handleFileChange} />
					</label>
					<button type="submit">Confirm Profile</button>
				</form>
			</div>
			<header>
				<h1>2FA</h1>
			</header>
		</div>
	);
}
export default UserProfileSettings;

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
	const [isEmptyForm, setIsEmptyForm] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const username = event.currentTarget.username.value;
		const formData = {};

		if (usernameInput.trim() !== "") {
			formData["username"] = usernameInput;
		}

		if (picture.data !== "") {
			formData["avatar"] = {
				file: picture.data,
				filename: picture.name,
			};
		}

		if (Object.keys(formData).length === 0) {
			setIsEmptyForm(true);
			return;
		}

		console.log(formData);
		setIsEmptyForm(false);
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
					{isEmptyForm && (
						<p className="empty-form-message">Please fill in at least one field</p>
					)}
					<label htmlFor="name">
						Username
						<input type="text" name="username" onChange={handleChange} />
					</label>
					<img
						className="avatar"
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

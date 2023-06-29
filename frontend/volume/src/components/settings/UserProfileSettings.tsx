import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { Link } from "react-router-dom";
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

function UserProfileSettings({ userdata }: { userdata: any }): JSX.Element {
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
		<div className="user_profile_settings">
			<header>
				<h1>Settings</h1>
				<h3>
					<Link to="/home">back to game</Link>
				</h3>
			</header>
			<div className="wrapper">
				<div className="avatar_container">
					<img src={convertEncodedImage(userdata.avatar.file)} alt="error no image" />
				</div>
				<form className="profile_form" method="post" onSubmit={handleSubmit}>
					{isEmptyForm && (
						<p className="empty-form-message">Please fill in at least one field</p>
					)}
					<div>
						<label htmlFor="name">
							<h3>Change username</h3>
							<input
								type="text"
								name="username"
								placeholder={userdata.username}
								onChange={handleChange}
							/>
						</label>
						<div className="flex_row_spacebetween">
							<h3>Change profile picture: </h3>
							<label className="choose_file" htmlFor="changeAvatar">
								<input
									id="changeAvatar"
									type="file"
									name="profilePicture"
									onChange={handleFileChange}
								/>
								<h3>select a new image</h3>
							</label>
						</div>
					</div>

					<button className="submit_button" type="submit">
						Save Profile
					</button>
				</form>
			</div>
			<header>
				<h1>2FA</h1>
			</header>
		</div>
	);
}
export default UserProfileSettings;

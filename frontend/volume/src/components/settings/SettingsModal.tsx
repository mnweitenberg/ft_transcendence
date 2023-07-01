import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { Link } from "react-router-dom";
import "src/styles/style.css";
import { useQueryCurrentUser } from "src/utils/useQueryUser";

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

export default function SettingsModule(): JSX.Element {
	const user = useQueryCurrentUser();
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
		<div className="modal_user_profile_settings">
			<div className="wrapper">
				<form className="profile_form" method="post" onSubmit={handleSubmit}>
					{isEmptyForm && (
						<p className="empty-form-message">Please fill in at least one field</p>
					)}
					<h3>Change profile picture </h3>
					<div className="change_avatar">
						<div className="avatar_container">
							<img src={convertEncodedImage(user.avatar.file)} alt="error no image" />
						</div>
						<label className="choose_file" htmlFor="changeAvatar">
							<input
								id="changeAvatar"
								type="file"
								name="profilePicture"
								onChange={handleFileChange}
							/>
							<h3>Select a new image</h3>
						</label>
					</div>
					<label htmlFor="name">
						<h3>Change username</h3>
						<input
							type="text"
							name="username"
							placeholder={user.username}
							onChange={handleChange}
						/>
					</label>
					<h3>2FA</h3>
					<input
						type="text"
						name="2FA"
						placeholder="phonenumber or leave blank to disable"
						onChange={handleChange}
					/>

					<button className="submit_button" type="submit">
						Save Profile
					</button>
				</form>
			</div>
		</div>
	);
}

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import "src/styles/login-pages/new-user.css";

const FORM_MUTATION = gql`
	mutation UploadAvatar($input: UploadAvatarInput!) {
		uploadAvatar(uploadAvatarInput: $input) {
			id
		}
	}
`;

function NewUser(): JSX.Element {
	const [formMutation, { loading, error, data }] = useMutation(FORM_MUTATION);
	const [base64Data, setBase64Data] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const file = base64Data;
		const filename = event.target.username.value;

		formMutation({
			variables: {
				input: { file, filename },
			},
		});
	};

	const handleFile = (e: any) => {
		const fileContent = e.result as string;
		const imgData = window.btoa(fileContent);
		setBase64Data(imgData);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) throw new Error();
		const fileReader = new FileReader();
		fileReader.onloadend = handleFile;
		fileReader.readAsBinaryString(event.target.files[0]);
	};

	return (
		<div className="main-wrap">
			<div className="user-form">
				<form method="post" onSubmit={handleSubmit}>
					<label htmlFor="name">
						Username
						<input type="text" id="username" name="username" />
					</label>
					<label htmlFor="Profile Picture">
						Profile Picture
						<input type="file" name="profile picture" onChange={handleFileChange} />
					</label>
					<button type="submit">Confirm Profile</button>
				</form>
			</div>
		</div>
	);
}
export default NewUser;

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import "src/styles/login-pages/new-user.css";

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

function NewUser(): JSX.Element {
	const [formMutation, { loading, error, data }] = useMutation(FORM_MUTATION);
	const [base64Data, setBase64Data] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		const username = event.currentTarget.username.value;
		const file = base64Data;
		const filename = event.currentTarget.profilePicture.value.name;

		formMutation({
			variables: {
				input: {
					username,
					avatar: { file, filename },
				},
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
		const file = event.target.files[0];

		fileReader.onloadend = handleFile;
		fileReader.readAsBinaryString(file);
	};

	return (
		<div className="main-wrap">
			<div className="user-form">
				<form method="post" onSubmit={handleSubmit}>
					<label htmlFor="name">
						Username
						<input type="text" name="username" />
					</label>
					<label htmlFor="Profile Picture">
						Profile Picture
						<input type="file" name="profilePicture" onChange={handleFileChange} />
					</label>
					<button type="submit">Confirm Profile</button>
				</form>
			</div>
		</div>
	);
}
export default NewUser;

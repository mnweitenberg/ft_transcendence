import { gql, useMutation } from "@apollo/client";
import * as i from "../../types/Interfaces";
import { useState } from "react";

const CREATE_CHANNEL = gql`
	mutation CreateChannel($name: String!, $logo: String!, $member_ids: [String!]!) {
		createGroupChat(name: $name, logo: $logo, member_ids: $member_ids) {
			id
			name
		}
	}
`;

// TO DO: add checks for existing channel
export default function CreateChannel(props: i.ModalProps & { refetchChannels: () => void }) {
	const [createChannel, { data }] = useMutation(CREATE_CHANNEL);

	const onSubmit = async (event: any) => {
		event.preventDefault();
		const form = event.currentTarget;
		const name = form.elements[0].value;
		const logo = form.elements[1].value;
		const member_ids = [props.userId];

		if (!name || !logo || member_ids.length === 0) {
			alert("All fields are required");
			return;
		}

		try {
			await createChannel({ variables: { name, logo, member_ids } });
			props.refetchChannels();
			props.setShowModal(false);
		} catch (error) {
			console.log("Error joining ", error);
		}
	};

	return (
		<div className="new_chat">
			<form onSubmit={onSubmit}>
				<h3>Name</h3>
				<input type="text" placeholder="Channel Name"></input>
				<h3>Image</h3>
				<input type="text" placeholder="Image URL"></input>
				<h3>Password</h3>
				<input type="text" placeholder="leave blank to create public channel"></input>
				<button type="submit">Create channel</button>
			</form>
		</div>
	);
}

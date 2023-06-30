import { useState } from "react";
import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { gql, useQuery } from "@apollo/client";

function Modal(props: i.ModalProps) {
	return (
		<>
			{props.showModal && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={() => props.setShowModal(false)}>
							&times;
						</span>
						{props.modalContent}
					</div>
				</div>
			)}
		</>
	);
}

export default Modal;

const CURRENT_USER = gql`
	query currentUserQuery {
		currentUserQuery {
			username
			avatar {
				file
			}
			id
		}
	}
`;

export function createModalProps(): i.ModalProps {
	const { loading, error, data } = useQuery(CURRENT_USER);

	// if (loading) return;
	// if (error) return;

	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalContent, setContent] = useState(<></>);

	function toggleModal(content: JSX.Element) {
		setContent(content);
		setShowModal(true);
	}
	let userId = "";
	let username = "";
	let avatarfile = "";
	if (!loading && !error) {
		userId = data.currentUserQuery.id;
		username = data.currentUserQuery.username;
		avatarfile = data.currentUserQuery.avatar.file;
	}

	const modalProps: i.ModalProps = {
		userId,
		username,
		avatarfile,
		toggleModal(content: JSX.Element) {
			toggleModal(content);
		},
		showModal,
		setShowModal,
		modalContent,
		setContent,
	};
	return modalProps;
}

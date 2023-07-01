import { useState, useEffect } from "react";
import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { gql, useQuery } from "@apollo/client";

function Modal(props: i.ModalProps) {
	const closeModal = () => {
		props.setShowModal(false);
	};

	useEffect(() => {
		if (props.showModal) {
			window.history.pushState(null, document.title, window.location.href);
		}
		// Listen to popstate event, which is fired when the history changes.
		const handlePopstate = () => {
			if (props.showModal) {
				props.setShowModal(false);
			} else {
				props.setShowModal(true);
			}
		};
		window.addEventListener("popstate", handlePopstate);
		return () => {
			window.removeEventListener("popstate", handlePopstate);
		};
	}, [props.showModal]);

	return (
		<>
			{props.showModal && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={() => closeModal()}>
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

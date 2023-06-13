import { useState } from "react";
import "../../styles/style.css";
import * as i from "../../types/Interfaces";

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

export function createModalProps(): i.ModalProps {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<any>();
	const [modalContent, setContent] = useState(<></>);

	function toggleModal(content: JSX.Element) {
		setContent(content);
		setShowModal(true);
	}

	const modalProps: i.ModalProps = {
		toggleModal(content: JSX.Element) {
			toggleModal(content);
		},
		selectedUser,
		setSelectedUser,
		showModal,
		setShowModal,
		modalContent,
		setContent,
	};
	return modalProps;
}

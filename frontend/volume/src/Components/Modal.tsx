import { useState } from 'react';
import '../css/style.css'
import UserStats from './UserStats';
import {user} from '../Defines/data';
import * as i from '../Defines/Interfaces';

function Modal( props: i.ModalProps ) {
	return (
		<>
		{props.showModal && (
		<div className="modal">
			<div className="modal-content">
				<span className="close" onClick={() => props.setShowModal(false)}>&times;</span>
				<UserStats user={props.selectedUser} />
			</div>
		</div>
		)}
		</>
	);
}

export default Modal

export function createModalProps() : i.ModalProps {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<i.User>(user);
	
	function togglePopup(userChoice: i.User) {
		setSelectedUser(userChoice)
		setShowModal(true);
	}
	
	const modalProps: i.ModalProps = {
		togglePopup(userChoice: i.User) { togglePopup(userChoice)},
		selectedUser,	setSelectedUser,
		showModal,		setShowModal,
	}
	return modalProps;	
}

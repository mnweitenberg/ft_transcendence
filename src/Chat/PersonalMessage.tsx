import { useState } from 'react';
import '../css/style.css'
import * as i from '../Defines/Interfaces';
import { chats, user } from '../Defines/data';
import { getChatsByUser } from '../Components/utils';

function PersonalMessage({ props, renderOverview }
	: {props: i.ModalProps, renderOverview: () => void }) {

	const handleMessageInput = (e: any) => {
		setMessage(e.target.value);
	};

	function sendMessage() : void {
		const newMessage: i.Chat = {
			id: chats.length,
			message: message,
			sender: user,
			reciever: props.selectedUser,
		}
		chats.push(newMessage);
		setMessage('');
	};

	const [message, setMessage] = useState('');

	window.onkeydown = function(e) {
		if (e.key === 'Enter' && message !== '')
			sendMessage();
	};

	let chatsWithFriend = getChatsByUser(chats, props.selectedUser);

	return (
	<div className='personalMessage'>
		<div className='chat_pm_header'>
			<div className='go_back'>
				<img className='arrow_back' src='../src/assets/img/arrow_back.png' onClick={renderOverview}/>
			</div>
			<div className='pm_user'>
				<img className='pm_avatar' src={props.selectedUser.avatar} />
				<h3>{props.selectedUser.name}</h3>
			</div>
			<div className='pm_info'>
				<a className='link challenge'>challenge</a>
				<a className='link stats' onClick={() => props.togglePopup(props.selectedUser)}>stats</a>
				<a className='link stats'>block</a>
			</div>
		</div>

		<div className='messages_container'>
			{chatsWithFriend && chatsWithFriend.map(function(chat) {
				if (chat.sender === user)
					return (<div className='user'> {chat.message} </div>);	
				return (<div className='friend'> {chat.message} </div>);	
			})}
		</div>

		<div className='send_container'>
			<input type='text' className='input_message' value={message} onChange={handleMessageInput}/>
			<img className='send_icon' src='../src/assets/img/send.png' onClick={sendMessage}/>
		</div>
	
	</div>
	);
}

export default PersonalMessage


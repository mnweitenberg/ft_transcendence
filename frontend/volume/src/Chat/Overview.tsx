import { useState } from 'react';
import '../css/style.css'
import PersonalMessage from './PersonalMessage';
import { user, chats } from '../Defines/data';
import * as i from '../Defines/Interfaces';
import { getChatsByUser } from '../Components/utils';
import { ChatState } from '../Defines/Constants';

// https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/

function Overview({props, setChatState} 
	: { props: i.ModalProps, setChatState: (state: ChatState) => void}) {
	function renderPersonalMessage(friend: i.User) {
		props.setSelectedUser(friend);
		setChatState(ChatState.pm);
	}
	return (
	<>
	{user.friends && user.friends.map(function(friend) {
		return (
			<div className='chat_container' key={friend.name + '_key'} onClick={() => renderPersonalMessage(friend)}>
			<img className='avatar' src={friend.avatar}/>
			<div className='wrap_name_message'>
				<div className='flex_row_spacebetween'>
					<h3 className='name'>{friend.name}</h3>
					<div className='status'>{friend.status}</div>
				</div>
				<div className='chat_preview'>{getChatsByUser(chats, friend) && getChatsByUser(chats, friend).at(-1)?.message}</div>
			</div>
			</div>
		);
	})}

	<div className='new_chat'>
		<a>new chat</a>
	</div>
	</>
	);
}
  
export default Overview;

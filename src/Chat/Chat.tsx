import { useState } from 'react';
import '../css/style.css'
import Overview from './Overview';
import PersonalMessage from './PersonalMessage';
import { user, chats } from '../Defines/data';
import * as i from '../Defines/Interfaces';
import { getChatsByUser } from '../Components/utils';
import { ChatState } from '../Defines/Constants';

// https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/

function Chat(props: i.ModalProps) {
	const [chatState, setChatState] = useState(ChatState.overview);

	function renderOverview() {
		setChatState(ChatState.overview);
	}

	if (chatState === ChatState.overview)
		return (<Overview props={props} setChatState={setChatState} />);

	if (chatState === ChatState.pm)
		return (<PersonalMessage props={props} renderOverview={renderOverview} />);

	return <>No state defined</>;
}
  
export default Chat;

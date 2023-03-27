import { useEffect } from 'react';
import './css/style.css'
import Chat from './Chat/Chat'
import Header from './Header'
import Profile from './Profile'
import Queue from './Queue'
import Ranking from './Ranking'
import Modal, { createModalProps } from './Components/Modal';
import Game, { createPongProps, handleFinishGame } from './Game/Game';
import { user } from './Defines/data'
import * as i from './Defines/Interfaces';

function App() {
	const modalProps: i.ModalProps = createModalProps();
	const pongProps: i.PongProps = createPongProps();

	// This useEffect will execute only when the "finished" state variable changes
	useEffect(() => {
		if (pongProps.finished) {
			handleFinishGame(pongProps);
		}
	}, [pongProps.finished]);

	// Prevent window from scrolling down when spacebar is hit (to serve)
	window.onkeydown = function(e) {
		return !(e.key == ' ' && e.target == document.body);
	};
	
	return (
	<div className='grid-container'>

		<div id="left_top"></div>

		<Header/>

		<div id="right_top">
			<a id='logout'>logout</a>
		</div>

		<section id="chat">
			<h1 className='section_header chat_profile_header'>Chat</h1>
			<div className='section_content'><Chat {...modalProps}/></div>
		</section>

		<div id='game'><Game {...pongProps}/></div>

		<section id="profile">
			<h1 className='section_header chat_profile_header'>{user.name}</h1>
			<div className='section_content'><Profile {...modalProps}/></div>
		</section>

		<section id="queue">
			<h1 className='section_header'>Queue</h1>
			<div className='section_content'><Queue {...modalProps}/></div>
		</section>

		<section id="ranking">
			<h1 className='section_header'>Ranking</h1>
			<div className='section_content'><Ranking/></div>
		</section>

		< Modal {...modalProps} />

  	</div>
	);
}

export default App


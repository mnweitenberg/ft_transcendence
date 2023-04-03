import { useState, useEffect } from "react";
import "./styles/style.css";
import Auth from "./components/Auth";
import Chat from "./components/chat/Chat";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Queue from "./components/Queue";
import Ranking from "./components/Ranking";
import Modal, { createModalProps } from "./components/common/Modal";
import Game, { createPongProps, handleFinishGame } from "./components/game/Game";
import { user } from "./utils/data";
import * as i from "./types/Interfaces";

function App() {
	const modalProps: i.ModalProps = createModalProps();
	const pongProps: i.PongProps = createPongProps();

	// This useEffect will execute only when the "finished" state variable changes
	useEffect(() => {
		if (pongProps.finished) {
			handleFinishGame(pongProps);
		}
	}, [pongProps.finished]);

	// LOGGING IN
	const [login, setLogin] = useState(false);
	function LogIn() {
		setLogin(!login);
	}

	if (!login) return <Auth LogIn={LogIn} />;

	return (
		<div className="grid-container">
			<div id="left_top"></div>

			<Header />

			<div id="right_top">
				<a id="logout" onClick={LogIn}>
					logout
				</a>
			</div>

			<section id="chat">
				<h1 className="section_header chat_profile_header">Chat</h1>
				<div className="section_content">
					<Chat {...modalProps} />
				</div>
			</section>

			<div id="game">
				<Game {...pongProps} />
			</div>

			<section id="profile">
				<h1 className="section_header chat_profile_header">{user.name}</h1>
				<div className="section_content">
					<Profile {...modalProps} />
				</div>
			</section>

			<section id="queue">
				{" "}
				<h1 className="section_header">Queue</h1>
				<div className="section_content">
					<Queue {...modalProps} />
				</div>
			</section>

			<section id="ranking">
				<h1 className="section_header">Ranking</h1>
				<div className="section_content">
					<Ranking {...modalProps} />
				</div>
			</section>

			<Modal {...modalProps} />
		</div>
	);
}

export default App;

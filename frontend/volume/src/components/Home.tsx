import { useState, useEffect } from "react";
import { ReactDOM } from "react";
import { BrowserRouter } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import "src/styles/style.css";
import Auth from "src/components/login/Auth";
import Chat from "src/components/chat/Chat";
import Header from "src/components/sections/Header";
import Profile from "src/components/sections/Profile";
import Queue from "src/components/sections/Queue";
import Ranking from "src/components/sections/Ranking";
import Modal, { createModalProps } from "src/components/common/Modal";
import Game, { createPongProps, handleFinishGame } from "src/components/game/Game";
import { user } from "src/utils/data";
import * as i from "src/types/Interfaces";

const LOGOUT_MUTATION = gql`
	mutation logoutMutation {
		logoutMutation
	}
`;

function Home() {
	const modalProps: i.ModalProps = createModalProps();
	const pongProps: i.PongProps = createPongProps();

	const [logoutMutation, { data, loading, error }] = useMutation(LOGOUT_MUTATION);

	// This useEffect will execute only when the "finished" state variable changes
	useEffect(() => {
		if (pongProps.finished) {
			handleFinishGame(pongProps);
		}
	}, [pongProps.finished]);

	return (
		<div className="grid-container">
			<div id="left_top"></div>

			<Header />

			<div id="right_top">
				<a
					id="logout"
					onClick={() => {
						logoutMutation();
						window.location.reload();
					}}
				>
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
export default Home;

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import "src/styles/style.css";
import Chat from "src/components/chat/Chat";
import Header from "src/components/sections/Header";
import Profile from "src/components/sections/Profile";
import Queue from "src/components/sections/Queue";
import Ranking from "src/components/sections/Ranking";
import Modal, { createModalProps } from "src/components/common/Modal";
import { Game, createPongProps, handleFinishGame } from "src/components/game/Game";
import * as i from "src/types/Interfaces";
import { useAuth } from "src/utils/authLogic";
import SettingsModal from "src/components/settings/SettingsModal";
import Loading from "./authorization/Loading";
import { CURRENT_USER } from "src/utils/graphQLQueries";

function Home(): JSX.Element {
	const modalProps: i.ModalProps = createModalProps();
	const pongProps: i.PongProps = createPongProps();

	const { onLogout } = useAuth();
	useEffect(() => {
		if (pongProps.finished) {
			handleFinishGame(pongProps);
		}
	}, [pongProps.finished]);

	const currentUser = useQuery(CURRENT_USER);
	if (currentUser.loading) return <Loading />;
	else if (currentUser.error) return <>Error</>;

	return (
		<div className="grid-container">
			<div id="left_top"></div>

			<Header {...pongProps} />

			<div id="right_top">
				{/* <Link to="/settings">settings</Link> */}
				<a
					onClick={() =>
						modalProps.toggleModal(<SettingsModal user={currentUser.data} />)
					}
				>
					settings
				</a>
				<a
					id="logout"
					onClick={() => {
						onLogout();
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
				<h1 className="section_header chat_profile_header">
					{currentUser.data.currentUserQuery.username}
				</h1>
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

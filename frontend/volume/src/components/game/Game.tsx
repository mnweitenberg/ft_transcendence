import { useState } from "react";
import Pong from "./Pong";
import * as i from "../../types/Interfaces";
import SocketSingleton from "../../utils/socketSingleton";

function updateScore(props: i.PongProps) {
	const socketSingleton = SocketSingleton.getInstance();

	socketSingleton.socket.on("noPlayers", () => {
		props.setPlayersAvailable(false);
	});

	socketSingleton.socket.on("players", (players: any) => {
		props.setPlayersAvailable(true);
		props.setPlayers(players);
	});

	socketSingleton.socket.on("playerScored", (score: number[]) => {
		props.setScore(score);
	});

	socketSingleton.socket.on("gameIsFinished", () => {
		props.setFinished(true);
	});
}

export function Game(props: i.PongProps) {
	updateScore(props);
	if (props.playersAvailable) return <Pong />;
	return (
		<div className="game_menu">
			<h1>Waiting for game...</h1>
		</div>
	);
}

export function createPongProps(): i.PongProps {
	const [finished, setFinished] = useState(false);
	const [playersAvailable, setPlayersAvailable] = useState(false);

	const [p1, setp1] = useState<any>({});
	const [p2, setp2] = useState<any>({});
	const players = [p1, p2];
	function setPlayers(players: i.User[]) {
		setp1(players[0]);
		setp2(players[1]);
	}

	const [scorep1, setScorep1] = useState(0);
	const [scorep2, setScorep2] = useState(0);
	const score = [scorep1, scorep2];
	function setScore(score: number[]) {
		setScorep1(score[0]);
		setScorep2(score[1]);
	}

	const pongProps: i.PongProps = {
		players,
		setPlayers,
		playersAvailable,
		setPlayersAvailable,
		finished,
		score,
		setScore,
		setFinished,
	};

	return pongProps;
}

export function handleFinishGame(pongProps: i.PongProps) {
	pongProps.setFinished(false);
}

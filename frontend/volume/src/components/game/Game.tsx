import { useState } from "react";
import Pong from "./Pong";
import * as i from "../../types/Interfaces";
import SocketSingleton from "../../utils/socketSingleton";

function updateScore(props: i.PongProps) {
	const socketSingleton = SocketSingleton.getInstance();

	socketSingleton.socket.on("players", (users: i.User[]) => {
		props.setPlayersAvailable(true);
		props.setPlayers(users);
	});
	socketSingleton.socket.on("playerScored", (score: number[]) => {
		props.setScore(score);
	});

	socketSingleton.socket.on("noPlayers", () => {
		props.setPlayersAvailable(false);
	});

	socketSingleton.socket.on("endOfGame", () => {
		props.setFinished(true);
	});
}

function Game(props: i.PongProps) {
	if (!props.players) return <h1 className="game_menu">No one wants to play</h1>;

	updateScore(props);

	if (props.bothPlayersReady) return <Pong />;

	return (
		<div className="game_menu" onClick={() => props.setBothPlayersReady(true)}>
			<h1>
				{props.players[0].username} vs {props.players[1].username}
			</h1>
			<h2>start game</h2>
		</div>
	);
}

export default Game;

export function createPongProps(): i.PongProps {
	const [bothPlayersReady, setBothPlayersReady] = useState(false);
	const [finished, setFinished] = useState(false);

	const [playerOne, setPlayerOne] = useState<i.User>({ username: "", avatar: "" });
	const [playerTwo, setPlayerTwo] = useState<i.User>({ username: "", avatar: "" });
	const [scorePlayerOne, setScorePlayerOne] = useState(0);
	const [scorePlayerTwo, setScorePlayerTwo] = useState(0);
	const [playersAvailable, setPlayersAvailable] = useState(false);

	const players = [playerOne, playerTwo];
	function setPlayers(players: i.User[]) {
		setPlayerOne(players[0]);
		setPlayerTwo(players[1]);
	}

	const score = [scorePlayerOne, scorePlayerTwo];
	function setScore(score: number[]) {
		setScorePlayerOne(score[0]);
		setScorePlayerTwo(score[1]);
	}

	const pongProps: i.PongProps = {
		players,
		setPlayers,
		playersAvailable,
		setPlayersAvailable,
		bothPlayersReady,
		setBothPlayersReady,
		finished,
		score,
		setScore,
		setFinished,
	};

	return pongProps;
}

export function handleFinishGame(pongProps: i.PongProps) {
	pongProps.setBothPlayersReady(false);
	// if (pongProps.gameScore) {
	// 	matchHistory.push(pongProps.gameScore);
	// 	queue.shift();
	// }
	// updateRanking(pongProps.gameScore);
	pongProps.setFinished(false);
}

// function updateRanking(match: i.GameScore) {
// 	if (match.score.playerOne > match.score.playerTwo) {
// 		match.playerOne.stats.wins += 1;
// 		match.playerOne.stats.score += 3;
// 		match.playerTwo.stats.losses += 1;
// 		match.playerTwo.stats.score -= 1;
// 	} else {
// 		match.playerTwo.stats.wins += 1;
// 		match.playerTwo.stats.score += 3;
// 		match.playerOne.stats.losses += 1;
// 		match.playerOne.stats.score -= 1;
// 	}
// 	// sort users based on their stats
// 	ranking.sort((a, b) => b.user.stats.score - a.user.stats.score);
// 	// update ranks
// 	ranking.forEach((item, index) => {
// 		item.rank = index + 1;
// 		item.user.stats.ranking = index + 1;
// 	});
// }

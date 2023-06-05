import { useState } from "react";
import Pong from "./Pong";
import * as i from "../../types/Interfaces";
import * as C from "../../utils/constants";
import SocketSingleton from "../../utils/socketSingleton";

function updateScore(props: i.PongProps) {
	const socketSingleton = SocketSingleton.getInstance();

	socketSingleton.socket.on("players", (users: i.User[]) => {
		props.setPlayersAvailable(true);
		props.setPlayers(users);
	});
	socketSingleton.socket.on("playerScored", (score: number[]) => {
		props.setScore(score);
		if (score[0] === C.MAX_SCORE || score[1] === C.MAX_SCORE) props.setFinished(true);
	});

	socketSingleton.socket.on("noPlayers", () => {
		props.setPlayersAvailable(false);
	});
}

function Game(props: i.PongProps) {
	if (!props.players) return <h1 className="game_menu">No one wants to play</h1>;

	updateScore(props);

	// if (props.bothPlayersReady) return <Pong />;
	if (props.playersAvailable) return <Pong />;

	// function startGame() {
	// props.setBothPlayersReady(true);
	// startNewGame();
	// }

	// if (!props.playersAvailable) return <h1 className="game_menu">No one wants to play</h1>;
	return (
		<div className="game_menu">
			<h1>Waiting for game...</h1>
			{/* <h1>
				{props.players[0].username} vs {props.players[1].username}
			</h1> */}
			{/* <h2>start game</h2> */}
		</div>
	);
}

export default Game;

export function createPongProps(): i.PongProps {
	const [bothPlayersReady, setBothPlayersReady] = useState(false);
	const [finished, setFinished] = useState(false);

	const [p1, setp1] = useState<i.User>({ username: "", avatar: "" });
	const [p2, setp2] = useState<i.User>({ username: "", avatar: "" });
	const [scorep1, setScorep1] = useState(0);
	const [scorep2, setScorep2] = useState(0);
	const [playersAvailable, setPlayersAvailable] = useState(false);

	const players = [p1, p2];
	function setPlayers(players: i.User[]) {
		setp1(players[0]);
		setp2(players[1]);
	}

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
	// updateRanking(pongProps.gameScore);
	pongProps.setFinished(false);
}

// function updateRanking(match: i.GameScore) {
// 	if (match.score.p1 > match.score.p2) {
// 		match.p1.stats.wins += 1;
// 		match.p1.stats.score += 3;
// 		match.p2.stats.losses += 1;
// 		match.p2.stats.score -= 1;
// 	} else {
// 		match.p2.stats.wins += 1;
// 		match.p2.stats.score += 3;
// 		match.p1.stats.losses += 1;
// 		match.p1.stats.score -= 1;
// 	}
// 	// sort users based on their stats
// 	ranking.sort((a, b) => b.user.stats.score - a.user.stats.score);
// 	// update ranks
// 	ranking.forEach((item, index) => {
// 		item.rank = index + 1;
// 		item.user.stats.ranking = index + 1;
// 	});
// }

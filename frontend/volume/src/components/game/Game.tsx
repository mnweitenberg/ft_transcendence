import { useState } from "react";
import Pong from "./Pong";
import { matchHistory, queue, ranking } from "../../utils/data";
import * as i from "../../types/Interfaces";
import SocketSingleton from "../../utils/socketSingleton";

function updateScore(props: i.PongProps) {
	const socketSingleton = SocketSingleton.getInstance();

	socketSingleton.socket.on("endOfGame", (gameScore: i.GameScore) => {
		props.setFinished(true);
	});
}

function Game(props: i.PongProps) {
	if (!props.gameScore) return <h1 className="game_menu">No one wants to play</h1>;

	updateScore(props);

	if (props.bothPlayersReady) return <Pong />;

	const winner = determineWinner();
	return (
		<div className="game_menu" onClick={() => props.setBothPlayersReady(true)}>
			<h2>{winner ? `${winner} Won` : ""}</h2>
			<h1>
				{props.gameScore.playerOne.name} vs {props.gameScore.playerTwo.name}
			</h1>
			<h2>start game</h2>
		</div>
	);
}

export default Game;

function determineWinner(): string | null {
	const lastMatch = matchHistory.at(-1);
	if (!lastMatch) return null;

	if (lastMatch.score.playerOne > lastMatch.score.playerTwo) return lastMatch.playerOne.name;
	return lastMatch.playerTwo.name;
}

export function createPongProps(): i.PongProps {
	const [bothPlayersReady, setBothPlayersReady] = useState(false);
	const [finished, setFinished] = useState(false);
	const [goToMenu, setGoToMenu] = useState(false);

	const nextGame = queue[0] || null;

	const pongProps: i.PongProps = {
		gameScore: nextGame,
		bothPlayersReady,
		setBothPlayersReady,
		finished,
		setFinished,
		goToMenu,
		setGoToMenu,
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
	pongProps.setGoToMenu(false);
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

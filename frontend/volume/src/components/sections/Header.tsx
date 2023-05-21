import "src/styles/style.css";
import SocketSingleton from "../../utils/socketSingleton";
// import { User } from "../../types/Interfaces";
import { useState } from "react";

interface User {
	intraId?: string;
	username: string;
	avatar: string;
}

function Header() {
	const socketSingleton = SocketSingleton.getInstance();

	const [playerOne, setPlayerOne] = useState<User>({ username: "", avatar: "" });
	const [playerTwo, setPlayerTwo] = useState<User>({ username: "", avatar: "" });
	const [scorePlayerOne, setScorePlayerOne] = useState(0);
	const [scorePlayerTwo, setScorePlayerTwo] = useState(0);
	const [Players, setPlayers] = useState(false);

	socketSingleton.socket.on("players", (users: User[]) => {
		setPlayers(true);
		setPlayerOne(users[0]);
		setPlayerTwo(users[1]);
	});
	socketSingleton.socket.on("setScorePlayerOne", (score: number) => {
		setScorePlayerOne(score);
	});
	socketSingleton.socket.on("setScorePlayerTwo", (score: number) => {
		setScorePlayerTwo(score);
	});

	socketSingleton.socket.on("noPlayers", () => {
		setPlayers(false);
	});
	if (!Players) return <header></header>;

	// const winsPlayerOne = getWinsByUser(matchHistory, gameScore.playerOne).length;
	// const lossesPlayerOne = getLossesByUser(matchHistory, gameScore.playerOne).length;
	// const winsPlayerTwo = getWinsByUser(matchHistory, gameScore.playerTwo).length;
	// const lossesPlayerTwo = getLossesByUser(matchHistory, gameScore.playerTwo).length;

	return (
		<header>
			<div className="player">
				<img className="avatar" src={playerOne.avatar}></img>
				<div className="wrap_name_message">
					<h3 className="name">{playerOne.username}</h3>
					<div className="stats">
						{/* <div className="stat">{winsPlayerOne} wins</div> */}
						<div className="stat">|</div>
						{/* <div className="stat">{lossesPlayerOne} losses</div> */}
					</div>
				</div>
			</div>

			<div className="score">
				<div className="player_one">{scorePlayerOne}</div>
				<div className="player_two">{scorePlayerTwo}</div>
			</div>

			<div className="player">
				<div className="wrap_name_message">
					<h3 className="name">{playerTwo.username}</h3>
					<div className="stats">
						{/* <div className="stat">{winsPlayerTwo} wins</div> */}
						<div className="stat">|</div>
						{/* <div className="stat">{lossesPlayerTwo} losses</div> */}
					</div>
				</div>
				<img className="avatar" src={playerTwo.avatar} />
			</div>
		</header>
	);
}

export default Header;

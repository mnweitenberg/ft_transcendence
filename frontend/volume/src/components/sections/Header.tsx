import "src/styles/style.css";
import { queue, matchHistory } from "src/utils/data";
import { getWinsByUser, getLossesByUser } from "src/utils/utils";

function Header() {
	if (queue.length === 0) return <></>;
	const gameScore = queue.at(0);
	if (!gameScore) return <></>;
	const winsPlayerOne = getWinsByUser(matchHistory, gameScore.playerOne).length;
	const lossesPlayerOne = getLossesByUser(matchHistory, gameScore.playerOne).length;
	const winsPlayerTwo = getWinsByUser(matchHistory, gameScore.playerTwo).length;
	const lossesPlayerTwo = getLossesByUser(matchHistory, gameScore.playerTwo).length;

	return (
		<header>
			<div className="player">
				<img className="avatar" src={gameScore.playerOne.avatar}></img>
				<div className="wrap_name_message">
					<h3 className="name">{gameScore.playerOne.name}</h3>
					<div className="stats">
						<div className="stat">{winsPlayerOne} wins</div>
						<div className="stat">|</div>
						<div className="stat">{lossesPlayerOne} losses</div>
					</div>
				</div>
			</div>

			<div className="score">
				<div className="player_one">{gameScore.score.playerOne}</div>
				<div className="player_two">{gameScore.score.playerTwo}</div>
			</div>

			<div className="player">
				<div className="wrap_name_message">
					<h3 className="name">{gameScore.playerTwo.name}</h3>
					<div className="stats">
						<div className="stat">{winsPlayerTwo} wins</div>
						<div className="stat">|</div>
						<div className="stat">{lossesPlayerTwo} losses</div>
					</div>
				</div>
				<img className="avatar" src={gameScore.playerTwo.avatar} />
			</div>
		</header>
	);
}

export default Header;

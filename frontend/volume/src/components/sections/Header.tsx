import "src/styles/style.css";
import * as i from "src/types/Interfaces";

function Header(props: i.PongProps) {
	if (!props.playersAvailable) return <header></header>;

	// const winsPlayerOne = getWinsByUser(matchHistory, gameScore.playerOne).length;
	// const lossesPlayerOne = getLossesByUser(matchHistory, gameScore.playerOne).length;
	// const winsPlayerTwo = getWinsByUser(matchHistory, gameScore.playerTwo).length;
	// const lossesPlayerTwo = getLossesByUser(matchHistory, gameScore.playerTwo).length;

	return (
		<header>
			<div className="player">
				<img className="avatar" src={props.players[0].avatar}></img>
				<div className="wrap_name_message">
					<h3 className="name">{props.players[0].username}</h3>
					<div className="stats">
						{/* <div className="stat">{winsPlayerOne} wins</div> */}
						<div className="stat">|</div>
						{/* <div className="stat">{lossesPlayerOne} losses</div> */}
					</div>
				</div>
			</div>

			<div className="score">
				<div className="player_one">{props.score[0]}</div>
				<div className="player_two">{props.score[1]}</div>
			</div>

			<div className="player">
				<div className="wrap_name_message">
					<h3 className="name">{props.players[1].username}</h3>
					<div className="stats">
						{/* <div className="stat">{winsPlayerTwo} wins</div> */}
						<div className="stat">|</div>
						{/* <div className="stat">{lossesPlayerTwo} losses</div> */}
					</div>
				</div>
				<img className="avatar" src={props.players[1].avatar} />
			</div>
		</header>
	);
}

export default Header;

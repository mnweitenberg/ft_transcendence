import "src/styles/style.css";
import * as i from "src/types/Interfaces";

function Header(props: i.PongProps) {
	if (!props.playersAvailable) return <header></header>;

	// const winsp1 = getWinsByUser(matchHistory, gameScore.p1).length;
	// const lossesp1 = getLossesByUser(matchHistory, gameScore.p1).length;
	// const winsp2 = getWinsByUser(matchHistory, gameScore.p2).length;
	// const lossesp2 = getLossesByUser(matchHistory, gameScore.p2).length;

	return (
		<header>
			<div className="player">
				<img className="avatar" src={props.players[0].avatar}></img>
				<div className="wrap_name_message">
					<h3 className="name">{props.players[0].username}</h3>
					<div className="stats">
						{/* <div className="stat">{winsp1} wins</div> */}
						<div className="stat">|</div>
						{/* <div className="stat">{lossesp1} losses</div> */}
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
						{/* <div className="stat">{winsp2} wins</div> */}
						<div className="stat">|</div>
						{/* <div className="stat">{lossesp2} losses</div> */}
					</div>
				</div>
				<img className="avatar" src={props.players[1].avatar} />
			</div>
		</header>
	);
}

export default Header;

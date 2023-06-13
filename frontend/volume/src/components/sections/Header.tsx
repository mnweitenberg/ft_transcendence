import "src/styles/style.css";
import * as i from "src/types/Interfaces";

function Header(props: i.PongProps) {
	if (!props.playersAvailable) return <header></header>;

	const [p1, p2] = props.players;
	const [p1Score, p2Score] = props.score;

	return (
		<header>
			<div className="player">
				<img className="avatar" src={p1.avatar}></img>
				<div className="wrap_name_message">
					<h3 className="name">{p1.username}</h3>
				</div>
			</div>

			<div className="score">
				<div className="player_one">{p1Score}</div>
				<div className="player_two">{p2Score}</div>
			</div>

			<div className="player">
				<div className="wrap_name_message">
					<h3 className="name">{p2.username}</h3>
				</div>
				<img className="avatar" src={p2.avatar} />
			</div>
		</header>
	);
}

export default Header;

import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { convertEncodedImage } from "src/utils/convertEncodedImage";

function Header(props: i.PongProps) {
	if (!props.playersAvailable) return <header></header>;

	const [p1, p2] = props.players;
	const [p1Score, p2Score] = props.score;

	return (
		<header>
			<div className="player">
				<div className="avatar_container">
					{/* <img src={convertEncodedImage(p1.avatar.file)}></img> */}
				</div>
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
				<div className="avatar_container">
					<img src={p2.avatar} />
				</div>
			</div>
		</header>
	);
}

export default Header;

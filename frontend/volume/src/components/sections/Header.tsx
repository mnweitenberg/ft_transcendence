import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { useQueryUser } from "src/utils/useQueryUser";

function Header(props: i.PongProps) {
	if (!props.playersAvailable) return <header></header>;

	const { user: p1, loading: loadingp1, error: errorp1 } = useQueryUser(props.players[0].id);
	const { user: p2, loading: loadingp2, error: errorp2 } = useQueryUser(props.players[1].id);

	if (!p1 || !p2) return <header></header>;
	if (loadingp1 || loadingp2) return <header></header>;
	if (errorp1 || errorp2) return <header></header>;

	const [p1Score, p2Score] = props.score;

	return (
		<header>
			<div className="player">
				<div className="avatar_container">
					<img src={convertEncodedImage(p1.avatar.file)}></img>
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
					<img src={convertEncodedImage(p2.avatar.file)}></img>
				</div>
			</div>
		</header>
	);
}

export default Header;

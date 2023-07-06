import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { useQueryUser } from "src/utils/useQueryUser";

function Header(props: i.PongProps) {
	if (!props.playersAvailable) return <header></header>;

	const [p1Score, p2Score] = props.score;

	return (
		<header>
			<LeftPlayer {...props.players[0]} />
			<div className="score">
				<div className="player_one">{p1Score}</div>
				<div className="player_two">{p2Score}</div>
			</div>
			<RightPlayer {...props.players[1]} />
		</header>
	);
}

function LeftPlayer(user: any, left: number) {
	const { user: player, loading: loading, error: error } = useQueryUser(user.id);

	if (!player) return <></>;
	if (loading) return <>Loading</>;
	if (error) return <>Error</>;

	return (
		<div className="player player_left">
			<div className="avatar_container">
				<img src={convertEncodedImage(player.avatar.file)}></img>
			</div>
			<h3 className="name">{player.username}</h3>
		</div>
	);
}

function RightPlayer(user: any, left: number) {
	const { user: player, loading: loading, error: error } = useQueryUser(user.id);

	if (!player) return <></>;
	if (loading) return <>Loading</>;
	if (error) return <>Error</>;

	return (
		<div className="player player_right">
			<div className="avatar_container">
				<img src={convertEncodedImage(player.avatar.file)}></img>
			</div>
			<h3 className="name">{player.username}</h3>
		</div>
	);
}

export default Header;

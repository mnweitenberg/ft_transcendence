import "../../styles/style.css";
import Stats from "./Stats";
import Friends from "./Friends";
import MatchHistory from "./MatchHistory";
import FriendRequestAlert from "./FriendRequestAlert";
import * as i from "../../types/Interfaces";
import { createChallengeAlert, createBlockAlert } from "../../utils/utils";
import { convertEncodedImage } from "src/utils/convertEncodedImage";

function UserStats({ user, modalProps }: { user: any; modalProps: i.ModalProps }) {
	console.log(user);
	const renderUserActions = () => {
		return (
			<div className="user_actions">
				<h1>{user.username}</h1>
				<a
					className="link"
					onClick={() => modalProps.toggleModal(createChallengeAlert(user, modalProps))}
				>
					challenge
				</a>
				<a
					className="link"
					onClick={() =>
						modalProps.toggleModal(
							<FriendRequestAlert user={user} modalProps={modalProps} />
						)
					}
				>
					send friend request
				</a>
				<a
					className="link"
					onClick={() => modalProps.toggleModal(createBlockAlert(user, modalProps))}
				>
					block
				</a>
			</div>
		);
	};

	return (
		<div className="userStats">
			<div className="user">
				<img className="avatar" src={convertEncodedImage(user.avatar.file)} />
				{renderUserActions()}
			</div>
			<Stats userId={user.id} />
			<MatchHistory userId={user.id} />
			<Friends {...modalProps} />
		</div>
	);
}

export default UserStats;

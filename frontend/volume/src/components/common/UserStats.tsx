import "../../styles/style.css";
import Stats from "./Stats";
import Friends from "./Friends";
import MatchHistory from "./MatchHistory";
import * as i from "../../types/Interfaces";
import {
	createChallengeAlert,
	createFriendRequestAlert,
	createBlockAlert,
} from "../../utils/utils";

function UserStats({ user, propsModal }: { user: any; propsModal: i.ModalProps }) {
	const renderUserActions = () => {
		return (
			<div className="user_actions">
				<h1>{user.username}</h1>
				<a
					className="link"
					onClick={() => propsModal.toggleModal(createChallengeAlert(user, propsModal))}
				>
					challenge
				</a>
				<a
					className="link"
					onClick={() =>
						propsModal.toggleModal(createFriendRequestAlert(user, propsModal))
					}
				>
					send friend request
				</a>
				<a
					className="link"
					onClick={() => propsModal.toggleModal(createBlockAlert(user, propsModal))}
				>
					block
				</a>
			</div>
		);
	};

	return (
		<div className="userStats">
			<div className="user">
				<img className="avatar" src={user.avatar.file} />
				{renderUserActions()}
			</div>
			<Stats userId={user.id} />
			<MatchHistory userId={user.id} />
			<Friends userId={user.id} />
		</div>
	);
}

export default UserStats;

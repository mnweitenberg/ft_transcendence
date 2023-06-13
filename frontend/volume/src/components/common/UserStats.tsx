import "../../styles/style.css";
import Stats from "./Stats";
import MatchHistory from "./MatchHistory";
import Friends from "./Friends";
import * as i from "../../types/Interfaces";
import { createChallengeAlert, createFriendRequesAlert, createBlockAlert } from "../../utils/utils";

function UserStats(props: i.ModalProps) {
	return (
		<div className="userStats">
			<div className="user">
				<img className="avatar" src={props.selectedUser.avatar} />

				<div className="user_actions">
					<h1>{props.selectedUser.name}</h1>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createChallengeAlert(props))
						}
					>
						challenge
					</a>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createFriendRequesAlert(props))
						}
					>
						send friend request
					</a>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createBlockAlert(props))
						}
					>
						block
					</a>
				</div>
			</div>

			<Stats user={props.selectedUser} />

			<MatchHistory user={props.selectedUser} />

			<Friends {...props} />
		</div>
	);
}

export default UserStats;

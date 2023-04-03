import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { createFriendRequesAlert, createLeaveGroupChatAlert } from "../../utils/utils";

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
							props.toggleModal(props.selectedUser, createFriendRequesAlert(props))
						}
					>
						change password
					</a>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createLeaveGroupChatAlert(props))
						}
					>
						leave group
					</a>
				</div>
			</div>
			<h2>Group members</h2>
			<div className="friend_list">
				{props.selectedUser.friends &&
					props.selectedUser.friends.map(function (friend) {
						return (
							<img
								className="friend_list--avatar"
								onClick={() => props.toggleModal(friend, <UserStats {...props} />)}
								key={friend.name}
								src={friend.avatar}
							/>
						);
					})}
			</div>
			Subject zegt niks over of we het wachtwoord van de group nog moeten aanpassen als dit
			lastig kunnen we deze pagina eventueel achterwege laten
		</div>
	);
}

export default UserStats;

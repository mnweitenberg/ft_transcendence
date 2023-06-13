import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";

function Friends(props: i.ModalProps) {
	return (
		<div className="stat_block">
			<h2>Friends</h2>
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
		</div>
	);
}

export default Friends;

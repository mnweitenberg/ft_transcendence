import "../../styles/style.css";
import * as i from "../../types/Interfaces";

function UserStats(props: i.ModalProps & { selectedUser: any }) {
	return (
		<div className="userStats">
			<div className="user">
				<img className="avatar" src="" />
				{/* <img className="avatar" src={props.selectedUser.avatar} /> */}

				<div className="user_actions">
					{/* <h1>{props.selectedUser.name}</h1> */}
					<h1>"[name of groupchat]"</h1>
					{/* only show if user is admin: */}
					<a className="link">change user priviliges</a>
					{/* only show if user is admin: */}
					<a className="link">change password</a>
				</div>
			</div>
			<h2>Group members</h2>
			<div className="friend_list">
				{props.selectedUser.friends &&
					props.selectedUser.friends.map(function (friend: any) {
						return (
							<img
								className="friend_list--avatar"
								onClick={() =>
									props.toggleModal(
										<UserStats {...props} selectedUser={friend} />
									)
								}
								key={friend.name}
								src={friend.avatar}
							/>
						);
					})}
			</div>
		</div>
	);
}

export default UserStats;

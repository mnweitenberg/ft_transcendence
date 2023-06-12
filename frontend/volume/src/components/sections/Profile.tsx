import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import Stats from "src/components/common/Stats";
import MatchHistory from "src/components/common/MatchHistory";
import * as i from "src/types/Interfaces";
import { queryCurrentUser } from "src/utils/queryUser";

export default function Profile(props: i.ModalProps) {
	const userId = queryCurrentUser().id;
	return (
		<>
			<Stats userId={userId} />

			<div className="match_history">
				<MatchHistory userId={userId} />
			</div>

			{/* <div className="friends">
				<h2>Friends</h2>
				<div className="friend_list">
					{user.friends &&
						user.friends.map(function (friend) {
							return (
								<img
									className="friend_list--avatar"
									onClick={() =>
										props.toggleModal(friend, <UserStats {...props} />)
									}
									key={friend.username}
									src={friend.avatar}
								/>
							);
						})}
				</div>
			</div> */}

			<div className="profile_section settings">
				<h2>Settings</h2>
				<div className="flex_row_spacebetween">
					<a onClick={() => props.toggleModal(null, createUsernameAlert())}>
						change username
					</a>
					<a onClick={() => props.toggleModal(null, createAvatarAlert())}>
						change avatar
					</a>
				</div>
			</div>
		</>
	);
}

function createUsernameAlert() {
	return (
		<div className="alert">
			<h2>Change username</h2>
			<form>
				<input type="text" placeholder="new username" />
				<button> submit </button>
			</form>
		</div>
	);
}

function createAvatarAlert() {
	const user = queryCurrentUser();
	return (
		<div className="alert">
			<h2>Change avatar</h2>
			<form>
				<div className="flex_row_spacebetween">
					<img src={user.avatar} />
					<input className="fileupload" type="file" />
				</div>
				<button> submit </button>
			</form>
		</div>
	);
}

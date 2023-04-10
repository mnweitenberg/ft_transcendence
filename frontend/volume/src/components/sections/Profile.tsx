import "src/styles/style.css";
import { user } from "src/utils/data";
import UserStats from "src/components/common/UserStats";
import Stats from "src/components/common/Stats";
import MatchHistory from "src/components/common/MatchHistory";
import * as i from "src/types/Interfaces";

export default function Profile(props: i.ModalProps) {
	return (
		<>
			<Stats user={user} />

			<div className="match_history">
				<MatchHistory user={user} />
			</div>

			<div className="friends">
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
									key={friend.name}
									src={friend.avatar}
								/>
							);
						})}
				</div>
			</div>

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

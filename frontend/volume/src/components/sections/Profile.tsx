import "src/styles/style.css";
import Stats from "src/components/common/Stats";
import MatchHistory from "src/components/common/MatchHistory";
import * as i from "src/types/Interfaces";
import { queryCurrentUser } from "src/utils/queryUser";
import Friends from "src/components/common/Friends";

export default function Profile(modalProps: i.ModalProps) {
	//	const userId = queryCurrentUser().id;
	const user = queryCurrentUser();
	if (user === "loading" || user === "error") {
		console.log(user);
		return user;
	}
	const userId = user.id;
	return (
		<>
			<Stats userId={userId} />

			<div className="match_history">
				<MatchHistory userId={userId} />
			</div>

			<div className="friends">
				<Friends {...modalProps} selectedUser={user} />
			</div>

			<div className="profile_section settings">
				<h2>Settings</h2>
				<div className="flex_row_spacebetween">
					<a onClick={() => modalProps.toggleModal(createUsernameAlert())}>
						change username
					</a>
					<a onClick={() => modalProps.toggleModal(createAvatarAlert())}>change avatar</a>
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
					<img src={user.avatar.file} />
					<input className="fileupload" type="file" />
				</div>
				<button> submit </button>
			</form>
		</div>
	);
}

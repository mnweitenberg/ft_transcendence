import "src/styles/style.css";
import Stats from "src/components/common/Stats";
import MatchHistory from "src/components/common/MatchHistory";
import * as i from "src/types/Interfaces";
import { queryCurrentUser } from "src/utils/queryUser";
import Friends from "src/components/common/Friends";

export default function Profile(modalProps: i.ModalProps) {
	const user = queryCurrentUser();
	if (user === "loading" || user === "error") return user;

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
		</>
	);
}

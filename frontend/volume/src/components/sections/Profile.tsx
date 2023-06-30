import "src/styles/style.css";
import Stats from "src/components/common/Stats";
import MatchHistory from "src/components/common/MatchHistory";
import * as i from "src/types/Interfaces";
import { useQueryCurrentUser } from "src/utils/useQueryUser";
import Friends from "src/components/common/Friends";

export default function Profile(modalProps: i.ModalProps) {
	const user = useQueryCurrentUser();
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

import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "../common/UserStats";
import { convertEncodedImage } from "../../utils/convertEncodedImage";

function GroupStats(props: i.ModalProps & { selectedGroup: any }) {
	return (
		<div className="userStats">
			<div className="user">
				<div className="avatar_container">
					<img src={convertEncodedImage(props.selectedGroup.logo)} />
				</div>
				{renderActions(props.selectedGroup.name)}
			</div>
			<h2>Group members</h2>
			<div className="friend_list">
				{props.selectedGroup.members &&
					props.selectedGroup.members.map(function (member: any) {
						return (
							<div className="friends_avatar_container" key={member.id}>
								<img
									onClick={() =>
										props.toggleModal(
											<UserStats {...props} selectedUser={member} />
										)
									}
									src={convertEncodedImage(member.avatar.file)}
								/>
							</div>
						);
					})}
			</div>
		</div>
	);
}

function renderActions(groupname: string) {
	// TO DO: check if user is admin
	const userIsAdmin = true;
	if (userIsAdmin) {
		return (
			<div className="user_actions">
				<h1>{groupname}</h1>
				<a className="link">change user priviliges</a>
				<a className="link">change password</a>
				<a className="link">leave group</a>
			</div>
		);
	}
	return (
		<div className="user_actions">
			<a className="link">leave group</a>
		</div>
	);
}

export default GroupStats;

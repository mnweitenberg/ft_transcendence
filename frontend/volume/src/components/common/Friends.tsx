import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { useFriendsData } from "src/utils/useFriendsData";

function Friends(modalProps: i.ModalProps & { selectedUser: any }) {
	const { friends, loading, error } = useFriendsData(modalProps.selectedUser.id);

	if (loading) return <div>Loading friends</div>;
	if (error) return <div>Error friends</div>;
	if (!friends) return <div>No friends</div>;
	return (
		<div className="stat_block">
			<h2>Friends</h2>
			<div className="friend_list">
				{friends.map(function (friend: any) {
					return (
						<div className="flex_col" key={friend.username}>
							<img
								src={convertEncodedImage(friend.avatar.file)}
								className="friend_list--avatar"
								onClick={() => {
									modalProps.toggleModal(
										<UserStats {...modalProps} selectedUser={friend} />
									);
								}}
							/>
							{friend.username}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Friends;

import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import UserStats from "./UserStats";
import { gql, useQuery } from "@apollo/client";

const GET_FRIENDS = gql`
	query {
		getFriends {
			username
		}
	}
`;

/*
	

*/
function Friends({ userId }: { userId: string }) {
	const { data, loading, error } = useQuery(GET_FRIENDS);

	if (loading) {
		return <div>Loading friends</div>;
	}
	if (error) {
		return <div>Error friends</div>;
	}
	return (
		<div className="stat_block">
			<h2>Friends</h2>
			<div className="friend_list">
				{data.getFriends.map(function (friend) {
					return (
						<div key={friend.username}>
							<h3 className="name">{friend.username}</h3>
							<img
								className="friend_list--avatar"
								onClick={() => props.toggleModal(friend, <UserStats {...props} />)}
								src={friend.avatar}
							/>
						</div>
					);
				})}
			</div>
			{/* <div>Friend requests</div> */}
		</div>
	);
}

export default Friends;

import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import Stats from "src/components/common/Stats";
import MatchHistory from "src/components/common/MatchHistory";
import * as i from "src/types/Interfaces";
import { gql, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { queryUsername } from "src/utils/queryUser";

// const USER = gql`
// 	query currentUserQuery {
// 		currentUserQuery {
// 			username
// 			avatar
// 		}
// 	}
// `;

interface User {
	username: string;
	avatar: string;
	// ranking: {
	// 	rank: number;
	// 	wins: number;
	// 	losses: number;
	// 	score: number;
	// };
}

export default function Profile(props: i.ModalProps) {
	// const { loading, error, data } = useQuery(USER);
	// const [user, setUser] = useState(null as User | null);
	// const { data, loading, error } = useSubcription(USER);

	// useEffect(() => {
	// 	if (data) setUser(data.rankingHasBeenUpdated);
	// }, [data]);

	// if (loading) return <div> Loading </div>;
	// if (error) return <div> Error </div>;
	// if (!user) return <div> No user </div>;

	// const user = data.currentUserQuery;
	// console.log(user);
	// const { rank, wins, losses, score } = user.ranking;

	return (
		<>
			{/* <Stats rank={rank} wins={wins} losses={losses} score={score} /> */}

			<div className="match_history">
				<MatchHistory />
				{/* <MatchHistory user={user} /> */}
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
	const user = queryUsername();
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

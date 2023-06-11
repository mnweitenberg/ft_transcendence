import "../../styles/style.css";
import Stats from "./Stats";
import MatchHistory from "./MatchHistory";
import Friends from "./Friends";
import * as i from "../../types/Interfaces";
import { createChallengeAlert, createFriendRequesAlert, createBlockAlert } from "../../utils/utils";
import { gql, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";

// const USER = gql`
// 	query currentUserQuery {
// 		currentUserQuery {
// 			username
// 			avatar
// 			ranking {
// 				rank
// 				wins
// 				losses
// 				score
// 			}
// 		}
// 	}
// `;

interface User {
	username: string;
	avatar: string;
	ranking: {
		rank: number;
		wins: number;
		losses: number;
		score: number;
	};
}

function UserStats(props: i.ModalProps) {
	// const [user, setUser] = useState(null as User | null);
	// const { data, loading, error } = useSubscription(USER);

	// useEffect(() => {
	// 	if (data) setUser(data.rankingHasBeenUpdated);
	// }, [data]);

	// if (loading) return <div> Loading </div>;
	// if (error) return <div> Error </div>;
	// if (!user) return <div> No user </div>;

	// console.log(user);
	// const { rank, wins, losses, score } = user.ranking;
	return <></>;
	return (
		<div className="userStats">
			<div className="user">
				{/* <img className="avatar" src={user.avatar} /> */}

				<div className="user_actions">
					{/* <h1>{user.username}</h1> */}
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createChallengeAlert(props))
						}
					>
						challenge
					</a>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createFriendRequesAlert(props))
						}
					>
						send friend request
					</a>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createBlockAlert(props))
						}
					>
						block
					</a>
				</div>
			</div>

			{/* <Stats rank={rank} wins={wins} losses={losses} score={score} /> */}

			{/* <MatchHistory user={props.selectedUser} /> */}

			<Friends {...props} />
		</div>
	);
}

export default UserStats;

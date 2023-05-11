import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";

const CURRENT_QUEUE_QUERY = gql`
	query {
		currentQueueQuery {
			matchId
			playerOne {
				name
				avatar
				stats {
					ranking
					wins
					losses
					score
				}
				status
			}
			playerTwo {
				name
				avatar
				stats {
					ranking
					wins
					losses
					score
				}
				status
			}
			score {
				playerOne
				playerTwo
			}
		}
	}
`;
const GAMER_SCORE_FOUND = gql`
	subscription gameScoreFound($user_id: String!) {
		gameScoreFound(user_id: $user_id) {
			playerOne {
				userId
			}
			playerTwo {
				userId
			}
		}
	}
`;

export default function Queue(props: i.ModalProps) {
	// TODO:
	// queue niet meer importen maar bijhouden op backend en dan hier queryen. Dan
	// subscription op queue die update als er nieuwe match is gevonden.
	//
	// versimpelen van joinQueue joinedQueue. zou geen verschil moeten zijn
	// tussen joinen als eerste en joinen als tweede. gewoon beide (en iedereen)
	// subscriben op de queue

	// OPZET
	// const {loading, error, data, subscribeToMore} = useQuery(CURRENT_QUEUE);
	// zie ook NewGroupMessage.tsx

	const { loading, error, data, subscribeToMore } = useQuery(CURRENT_QUEUE_QUERY);

	useEffect(() => {
		return subscribeToMore({
			document: GAMER_SCORE_FOUND,
			variables: { user_id: user_id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newMatch = subscriptionData.data.gameScore;
				return Object.assign({}, prev, {
					// getChannel: {
					// 	...prev.getChannel,
					// 	messages: [...prev.getChannel.messages, newMessage],
					// },
				});
			},
		});
	}, []);

	console.log("data = ");
	console.log([data]);

	const rij: Array<i.GameScore> = [data];

	return (
		<>
			{rij.map(function (game) {
				if (!game.playerOne || !game.playerTwo) return <JoinQueueElement />;
				return (
					// TODO: Add a unique key to the div
					<div
						className="flex_row_spacebetween"
						key={game.playerOne.name + game.playerTwo.name}
					>
						<div
							className="player player--one"
							onClick={() =>
								props.toggleModal(game.playerOne, <UserStats {...props} />)
							}
						>
							<h3 className="name">{game.playerOne.name}</h3>
							<img className="avatar" src={game.playerOne.avatar} />
						</div>

						<div
							className="player player--two"
							onClick={() =>
								props.toggleModal(game.playerTwo, <UserStats {...props} />)
							}
						>
							<img className="avatar" src={game.playerTwo.avatar} />
							<h3 className="name">{game.playerTwo.name}</h3>
						</div>
					</div>
				);
			})}
			<JoinQueueElement />
		</>
	);
}

// TODO: remove if above works
// 	return (
// 		<>
// 			{queue.map(function (game) {
// 				if (!game.playerOne || !game.playerTwo) return <JoinQueueElement />;
// 				return (
//
// 					<div
// 						className="flex_row_spacebetween"
// 						key={game.playerOne.name + game.playerTwo.name}
// 					>
// 						<div
// 							className="player player--one"
// 							onClick={() =>
// 								props.toggleModal(game.playerOne, <UserStats {...props} />)
// 							}
// 						>
// 							<h3 className="name">{game.playerOne.name}</h3>
// 							<img className="avatar" src={game.playerOne.avatar} />
// 						</div>

// 						<div
// 							className="player player--two"
// 							onClick={() =>
// 								props.toggleModal(game.playerTwo, <UserStats {...props} />)
// 							}
// 						>
// 							<img className="avatar" src={game.playerTwo.avatar} />
// 							<h3 className="name">{game.playerTwo.name}</h3>
// 						</div>
// 					</div>
// 				);
// 			})}
// 			<JoinQueueElement />
// 		</>
// 	);
// }

const JOIN_QUEUE = gql`
	mutation joinQueue($userId: String!) {
		joinQueue(user_id: $userId) {
			playerOne {
				userId
			}
			playerTwo {
				userId
			}
		}
	}
`;
function JoinQueueElement() {
	const [
		joinQueue,
		{
			data: queue_data,
			loading: queue_loading,
			error: queue_error,
			called: tried_joining_queue,
		},
	] = useMutation(JOIN_QUEUE);

	const [user_id, set_user_id] = useState(""); // TODO: use other way to get own user_id

	const handleClick = (event) => {
		event.preventDefault();

		const user_id = event.target.elements.userId.value;
		set_user_id(user_id); // TODO: remove together with the useState

		joinQueue({
			variables: {
				userId: user_id,
			},
		});
	};

	if (tried_joining_queue) {
		if (queue_loading) {
			return <>joining queue...</>;
		}
		if (queue_error) {
			console.log(queue_error);
			return <>error joining queue</>;
		}
		if (queue_data.joinQueue === null) {
			return <JoinedQueue user_id={user_id} />;
		} else {
			return (
				<>
					Match found: {queue_data.joinQueue.playerOne.userId} vs{" "}
					{queue_data.joinQueue.playerTwo.userId}
				</>
			);
		}
	} else {
		return (
			<form onSubmit={handleClick}>
				<input type="text" name="userId" placeholder="Voor testing only" />
				<button type="submit">Join queue</button>
			</form>
		);
	}
}

const MATCH_FOUND = gql`
	subscription matchFound($user_id: String!) {
		matchFound(user_id: $user_id) {
			matched
			playerOneId
			playerTwoId
		}
	}
`;

function JoinedQueue({ user_id }: { user_id: string }) {
	const { data, loading, error } = useSubscription(GAMER_SCORE_FOUND, {
		variables: { user_id: user_id },
	});

	if (error) alert(error.message);

	if (loading) return <div> Joined the Queue! </div>;

	return (
		<div>
			Match found: {data.gameScoreFound.playerOne.userId} vs{" "}
			{data.gameScoreFound.playerTwo.userId}
		</div>
	);
}

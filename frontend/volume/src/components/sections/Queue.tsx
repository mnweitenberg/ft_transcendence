import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useMutation, useSubscription, useQuery } from "@apollo/client";


nieuwe dag, 

check of als er queued matches zijn deze worden geladen als je pagina opent op nieuwe browser
same maar dan met login van iemand anders


const CURRENT_USER = gql`
	query currentUserQuery {
		currentUserQuery {
			id
		}
	}
`;

const GET_QUEUED_MATCH = gql`
	query getQueuedMatch {
		getQueuedMatch {
			playerOne {
				username
				avatar
			}
		}
	}
`;

const GET_WHOLE_QUEUE = gql`
	query getWholeQueue {
		getWholeQueue {
			playerOne {
				username
				avatar
			}
			playerTwo {
				username
				avatar
			}
		}
	}
`;

const MATCH_FOUND = gql`
	subscription matchFound {
		matchFound {
			playerOne {
				username
				avatar
			}
			playerTwo {
				username
				avatar
			}
		}
	}
`;

const JOIN_QUEUE = gql`
	mutation joinQueue($user_id: String!) {
		joinQueue(user_id: $user_id) {
			playerOne {
				username
			}
			playerTwo {
				username
			}
		}
	}
`;

export default function Queue(props: i.ModalProps) {
	const {
		data: queue_data,
		loading: queue_loading,
		error: queue_error,
		subscribeToMore,
	} = useQuery(GET_WHOLE_QUEUE);

	useEffect(() => {
		return subscribeToMore({
			document: MATCH_FOUND,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newMatch = subscriptionData.data.matchFound;
				return Object.assign({}, prev, {
					getWholeQueue: [...prev.getWholeQueue, newMatch],
				});
			},
		});
	}, []);

	if (!queue_data) return <div>waarom moet dit</div>; // FIXME: zonder dit werkt frontend niet...
	return (
		<>
			{queue_data.getWholeQueue.map(function (game: any) {
				if (!game.playerOne || !game.playerTwo) return <JoinQueueElement />;
				return (
					<div
						className="flex_row_spacebetween"
						key={game.playerOne.username + game.playerTwo.username}
					>
						<div className="player player--one">
							<h3 className="name">{game.playerOne.username}</h3>
							<img className="avatar" src={game.playerOne.avatar} />
						</div>

						<div className="player player--two">
							<img className="avatar" src={game.playerTwo.avatar} />
							<h3 className="name">{game.playerTwo.username}</h3>
						</div>
					</div>
				);
			})}
			<JoinQueueElement />
		</>
	);
}

// TODO: joinQueue moet userid automatisch opvragen (uit cookie?). 'Join Queue' knop moet wel /niet zichtbaar zijn op
// basis van of iemand al gequeued is.
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

	const { data: user_data, loading: user_loading, error: user_error } = useQuery(CURRENT_USER);
	let user_id = ""; // FIXME: nodig?
	if (user_loading) {
		console.log("loading placeholder"); // FIXME:
	}
	if (user_error) {
		console.log("in CURRENT_USER query", user_error);
	} else if (user_data) {
		user_id = user_data.currentUserQuery.id;
	}

	const handleClick = (event: any) => {
		event.preventDefault();

		joinQueue({
			variables: {
				user_id: user_id,
			},
		});
	};

	if (tried_joining_queue) {
		if (queue_loading) {
			return <>joining queue...</>;
		}
		if (queue_error) {
			console.log("in JOIN_QUEUE mutation ", queue_error);
			return <>error joining queue</>;
		}
		if (queue_data.joinQueue === null) {
			return <JoinedQueue user_id={user_id} />;
		} else {
			return (
				<>
					Match found: {queue_data.joinQueue.playerOne.username} vs{" "}
					{queue_data.joinQueue.playerTwo.username}
				</>
			);
		}
	} else {
		return (
			<form onSubmit={handleClick}>
				{/* <input type="text" name="user_id" placeholder="Voor testing only" /> */}
				<button type="submit">Join queue</button>
			</form>
		);
	}
}

function JoinedQueue({ user_id }: { user_id: string }) {
	const { data, loading, error } = useSubscription(MATCH_FOUND);

	if (loading) {
		return <div> Joined the queue! </div>;
	}
	if (error) console.log("in MATCH_FOUND subscription ", error);

	if (data)
		return (
			<div>
				Match found: {data.matchFound.playerOne.username} vs{" "}
				{data.matchFound.playerTwo.username}
			</div>
		);
}

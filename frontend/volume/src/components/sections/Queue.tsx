// import "src/styles/style.css";
// import * as i from "src/types/Interfaces";
// import { useState, useEffect } from "react";
// import { gql, useMutation, useSubscription, useQuery } from "@apollo/client";

// const QUEUE_CHANGED = gql`
// 	subscription queueChanged {
// 		queueChanged {
// 			p1 {
// 				username
// 				avatar
// 			}
// 			p2 {
// 				username
// 				avatar
// 			}
// 		}
// 	}
// `;

// const JOIN_QUEUE = gql`
// 	mutation joinQueue {
// 		joinQueue
// 	}
// `;

// const SET_INITIAL_QUEUE = gql`
// 	query setInitialQueue {
// 		setInitialQueue
// 	}
// `;

// export default function Queue(props: i.ModalProps) {
// 	const { data, loading, error } = useSubscription(QUEUE_CHANGED);
// 	const { loading: initial_loading, error: initial_error } = useQuery(SET_INITIAL_QUEUE);
// 	const [queue, setQueue] = useState([]);
// 	useEffect(() => {
// 		if (data) {
// 			setQueue(data.queueChanged);
// 		}
// 	}, [data]);
// 	if (error) return <div> Error </div>;
// 	if (loading) console.log("");

// 	console.log(queue);

// 	if (initial_error) return <div> Error </div>;
// 	if (initial_loading) return <div> laoding queue </div>;

// 	return (
// 		<>
// 			{queue.map(function (game: any) {
// 				// if (!game.p1 || !game.p2) return <JoinQueueElement />;
// 				if (!game.p1 || !game.p2) return;
// 				return (
// 					<div
// 						className="flex_row_spacebetween"
// 						key={game.p1.username + game.p2.username}
// 					>
// 						<div className="player player--one">
// 							<h3 className="name">{game.p1.username}</h3>
// 							<img className="avatar" src={game.p1.avatar} />
// 						</div>
// 						<div className="player player--two">
// 							<img className="avatar" src={game.p2.avatar} />
// 							<h3 className="name">{game.p2.username}</h3>
// 						</div>
// 					</div>
// 				);
// 			})}
// 			<JoinQueueElement />
// 		</>
// 	);
// }

import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useMutation, useSubscription, useQuery } from "@apollo/client";

// const CURRENT_USER = gql`
// 	query currentUserQuery {
// 		currentUserQuery {
// 			id
// 	}
// `;

// const GET_QUEUED_MATCH = gql`
// 	query getQueuedMatch {
// 		getQueuedMatch {
// 			p1 {
// 				username
// 				avatar
// 			}
// 		}
// 	}
// `;

const GET_WHOLE_QUEUE = gql`
	query getWholeQueue {
		getWholeQueue {
			p1 {
				username
				avatar
			}
			p2 {
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
			p1 {
				username
			}
			p2 {
				username
			}
		}
	}
`;

const QUEUE_CHANGED = gql`
	subscription queueChanged {
		queueChanged {
			p1 {
				username
				avatar
			}
			p2 {
				username
				avatar
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
			document: QUEUE_CHANGED,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newQueue = subscriptionData.data.queueChanged;
				return Object.assign({}, prev, {
					getWholeQueue: newQueue,
				});
			},
		});
	}, []);

	if (!queue_data) return <div>waarom moet dit</div>; // FIXME: zonder dit werkt frontend niet...
	return (
		<>
			{queue_data.getWholeQueue.map(function (game: any) {
				// if (!game.p1 || !game.p2) return <JoinQueueElement />;
				return (
					<div
						className="flex_row_spacebetween"
						key={game.p1.username + game.p2.username}
					>
						<div className="player player--one">
							<h3 className="name">{game.p1.username}</h3>
							<img className="avatar" src={game.p1.avatar} />
						</div>

						<div className="player player--two">
							<img className="avatar" src={game.p2.avatar} />
							<h3 className="name">{game.p2.username}</h3>
						</div>
					</div>
				);
			})}
			<JoinQueueElement />
		</>
	);
}

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

	const handleClick = (event: any) => {
		event.preventDefault();
		joinQueue();
	};

	if (tried_joining_queue) {
		if (queue_loading) {
			return <>joining queue...</>;
		}
		if (queue_error) {
			return <>error joining queue</>;
		}
		if (queue_data.joinQueue === null) {
			return null;
			// return <JoinedQueue user_id={user_id} />;
		} else {
			return <>{queue_data.joinQueue}</>;
		}
	} else {
		return (
			<form onSubmit={handleClick}>
				<button type="submit">Join queue</button>
			</form>
		);
	}
}

// function JoinedQueue({ user_id }: { user_id: string }) {
// const { data, loading, error } = useSubscription(MATCH_FOUND);
// if (loading) {
// 	return <div> Joined the queue! </div>;
// }
// if (error) console.log("in MATCH_FOUND subscription ", error);
// if (data)
// 	return (
// 		<div>
// 			Match found: {data.matchFound.playerOne.username} vs{" "}
// 			{data.matchFound.playerTwo.username}
// 		</div>
// 	);
// return (
// 	<div>
// 		Match found: {data.matchFound.p1.username} vs{" "}
// 		{data.matchFound.p2.username}
// 	</div>
// );
// }

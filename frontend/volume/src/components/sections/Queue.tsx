import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useMutation, useSubscription, useQuery } from "@apollo/client";

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
			p1 {
				username
				avatar
			}
		}
	}
`;

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

export default function Queue(props: i.ModalProps) {
	const [queue, setQueue] = useState([]);
	const { data, loading, error } = useSubscription(QUEUE_CHANGED);
	useEffect(() => {
		if (data) {
			setQueue(data.queueChanged);
		}
	}, [data]);
	if (loading) {
		return <div> Queue is changing. Please wait </div>;
	}
	if (error) console.log("in QUEUE_CHANGED subscription ", error);
	return (
		<>
			{queue.map(function (game: any) {
				if (!game.p1 || !game.p2) return <JoinQueueElement />;
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

	// const { data: user_data, loading: user_loading, error: user_error } = useQuery(CURRENT_USER);
	// let user_id = ""; // FIXME: nodig?
	// if (user_loading) {
	// 	console.log("loading placeholder"); // FIXME:
	// }
	// if (user_error) {
	// 	console.log("in CURRENT_USER query", user_error);
	// } else if (user_data) {
	// 	user_id = user_data.currentUserQuery.id;
	// }

	const handleClick = (event: any) => {
		event.preventDefault();

		// joinQueue({
		// 	variables: {
		// 		user_id: user_id,
		// 	},
		// });
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
					Match found: {queue_data.joinQueue.p1.username} vs{" "}
					{queue_data.joinQueue.p2.username}
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
}

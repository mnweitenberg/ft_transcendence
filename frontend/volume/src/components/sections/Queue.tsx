import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

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

const JOIN_QUEUE = gql`
	mutation joinQueue {
		joinQueue
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

// TODO: add waiting for queue met plaatje (zie begin code voor html)
//	check of queue goed update nadat joinQueue is geklikt

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

	if (!queue_data) return <div> No queue </div>;
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
		// if (queue_data.joinQueue === null) {
		// 	return null;
		// 	// return <JoinedQueue user_id={user_id} />;
		// } else
		{
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

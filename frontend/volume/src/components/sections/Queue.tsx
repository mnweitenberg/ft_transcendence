import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useMutation, useSubscription, useQuery } from "@apollo/client";

const MATCH_FOUND = gql`
	subscription matchFound {
		matchFound {
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

	const [user_id, set_user_id] = useState(""); // TODO: use other way to get own user_id

	const handleClick = (event: any) => {
		event.preventDefault();

		const user_id = event.target.elements.user_id.value;
		set_user_id(user_id); // TODO: remove together with the useState

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
			console.log(queue_error);
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
				<input type="text" name="user_id" placeholder="Voor testing only" />
				<button type="submit">Join queue</button>
			</form>
		);
	}
}

function JoinedQueue({ user_id }: { user_id: string }) {
	const { data, loading, error } = useSubscription(MATCH_FOUND);

	if (error) alert(error.message);

	return <div> Joined the Queue! </div>;

	// return (
	// 	<div>
	// 		Match found: {data.matchFound.p1.username} vs{" "}
	// 		{data.matchFound.p2.username}
	// 	</div>
	// );
}

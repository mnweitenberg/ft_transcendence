import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_WHOLE_QUEUE = gql`
	query getWholeQueue {
		getWholeQueue {
			p1 {
				username
				avatar {
					file
				}
			}
			p2 {
				username
				avatar {
					file
				}
			}
		}
	}
`;

const CURRENT_USER = gql`
	query currentUserQuery {
		currentUserQuery {
			username
			avatar {
				file
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
				avatar {
					file
				}
			}
			p2 {
				username
				avatar {
					file
				}
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

	if (queue_loading) return <div> Loading queue </div>;
	if (queue_error) {
		console.log(queue_error);
		return <div> Queue error </div>;
	}
	return (
		<>
			<JoinQueueElement />
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
	const { data: user_data, loading: user_loading, error: user_error } = useQuery(CURRENT_USER);

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

		return (
			<>
				<div className="player player--one">
					<h3 className="name">{user_data.currentUserQuery.username}</h3>
					<img className="avatar" src={user_data.currentUserQuery.avatar} />
					<h3> {queue_data.joinQueue} </h3>
				</div>
				{/* <button disabled={true}>Join queue </button> */}
			</>
		);
	} else {
		return (
			<form onSubmit={handleClick}>
				<button type="submit">Join queue</button>
			</form>
		);
	}
}

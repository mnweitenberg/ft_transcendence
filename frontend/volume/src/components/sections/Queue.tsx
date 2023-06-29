import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import UserStats from "src/components/common/UserStats";

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

// TODO: joinQueue knop moet terug komen nadat user niet meer in queue of match zit

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
				return (
					<div
						className="flex_row_spacebetween"
						key={game.p1.username + game.p2.username}
					>
						<div
							className="player player--one"
							onClick={() =>
								props.toggleModal(<UserStats {...props} selectedUser={game.p1} />)
							}
						>
							<h3 className="name">{game.p1.username}</h3>
							<div className="avatar_container">
								<img src={game.p1.avatar} />
							</div>
						</div>

						<div
							className="player player--two"
							onClick={() =>
								props.toggleModal(<UserStats {...props} selectedUser={game.p2} />)
							}
						>
							<div className="avatar_container">
								<img src={game.p2.avatar} />
							</div>
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
				<div>{queue_data.joinQueue}</div>
				<form onSubmit={handleClick}>
					<button type="submit">Join queue</button>
				</form>
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

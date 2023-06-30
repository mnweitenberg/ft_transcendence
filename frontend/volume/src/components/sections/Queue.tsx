import "src/styles/style.css";
import * as i from "src/types/Interfaces";
import { useEffect } from "react";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
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

const CURRENT_USER = gql`
	query currentUserQuery {
		currentUserQuery {
			id
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

const GET_QUEUE_AVAILABILITY = gql`
	query {
		getQueueAvailability {
			queueStatus
		}
	}
`;

const QUEUE_AVAILABILITY_CHANGED = gql`
	subscription queueAvailabilityChanged($userId: String!) {
		queueAvailabilityChanged(userId: $userId) {
			queueStatus
		}
	}
`;

enum QueueStatus {
	CAN_JOIN,
	IN_MATCH,
	IN_QUEUE,
}

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
								<img src={convertEncodedImage(game.p1.avatar.file)} />
							</div>
						</div>

						<div
							className="player player--two"
							onClick={() =>
								props.toggleModal(<UserStats {...props} selectedUser={game.p2} />)
							}
						>
							<div className="avatar_container">
								<img src={convertEncodedImage(game.p2.avatar.file)} />
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
	const [joinQueue, { loading: queue_loading, error: queue_error }] = useMutation(JOIN_QUEUE);
	const { data: user_data, loading: user_loading, error: user_error } = useQuery(CURRENT_USER);
	const { data: queue_availability, subscribeToMore } = useQuery(GET_QUEUE_AVAILABILITY);

	useEffect(() => {
		if (!user_data?.currentUserQuery) return;
		return subscribeToMore({
			document: QUEUE_AVAILABILITY_CHANGED,
			variables: { userId: user_data.currentUserQuery.id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return Object.assign({}, prev, {
					getQueueAvailability: subscriptionData.data.queueAvailabilityChanged,
				});
			},
		});
	}, [user_data]);

	if (user_loading) return <>Loading user</>;

	const handleClick = (event: any) => {
		event.preventDefault();
		joinQueue();
	};

	if (queue_loading) {
		return <>Loading queue...</>;
	}
	if (queue_error) {
		return <>error joining queue</>;
	}
	if (queue_availability?.getQueueAvailability.queueStatus === QueueStatus.CAN_JOIN) {
		return (
			<form onSubmit={handleClick}>
				<button type="submit">Join queue</button>
			</form>
		);
	} else if (queue_availability?.getQueueAvailability.queueStatus === QueueStatus.IN_QUEUE) {
		return (
			<div>
				<h3>'Join queue' not available. You are in the queue </h3>
			</div>
		);
	} else if (queue_availability?.getQueueAvailability.queueStatus === QueueStatus.IN_MATCH) {
		return (
			<div>
				<h3>'Join queue' not available. You are in a match</h3>
			</div>
		);
	}
}

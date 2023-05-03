import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useState } from "react";
import { gql, useMutation, useSubscription } from "@apollo/client";

export default function Queue(props: i.ModalProps) {
	return (
		<>
			{queue.map(function (game) {
				if (!game.playerOne || !game.playerTwo) return <JoinQueueElement />;
				return (
					// TO DO: Add a unique key to the div
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

const JOIN_QUEUE = gql`
	mutation joinQueue($userId: String!) {
		joinQueue(userId: $userId) {
			playerOneId
			playerTwoId
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
			return <>error joining queue</>;
		}
		if (queue_data.joinQueue === null) {
			return <JoinedQueue user_id={user_id} />;
		} else {
			return <>found a match: {JSON.stringify(queue_data.joinQueue)}</>;
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
	const { data, loading, error } = useSubscription(MATCH_FOUND, {
		variables: { user_id: user_id },
	});

	if (error) alert(error.message);

	if (loading) return <div> Joined the Queue! </div>;

	return (
		<div>
			Playerone = {data.matchFound.playerOneId} vs PlayerTwo = {data.matchFound.playerTwoId}
		</div>
	);
}

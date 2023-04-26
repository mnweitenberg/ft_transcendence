import "src/styles/style.css";
import React from "react";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { GameScore } from "src/types/Interfaces";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";

export default function Queue(props: i.ModalProps) {
	// onSubscriptionData: ({ subscriptionData }) => {
	// const newMatch = subscriptionData.data.eventEmitter;

	// 	if (loading)
	// 		return <div> Queueing... </div>

	// };

	// alert(matchData.playerOne);

	// query maken om queue object te vullen vanaf database zodat we deze kunnen pushen aan de queue.
	// denk beter vanaf backend
	// const match = new i.GamerScore;
	// queue.push(match);

	// return (
	// 	<div>
	// 		<h1>Match found!</h1>
	// 		<p>Player One: {matchData.playerOneName} </p>
	// 		<p>Player Two: {matchData.playerTwoName} </p>
	// 	</div>
	// );

	return (
		<>
			{queue.map(function (game) {
				if (!game.playerOne || !game.playerTwo) return <JoinQueue />;
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
			<JoinQueue />
		</>
	);
}

const JOIN_GLOBAL_QUEUE = gql`
	mutation joinGlobalQueue($username: String!) {
		joinGlobalQueue(username: $username)
	}
`;

const MATCH_FOUND = gql`
	subscription {
		matchFound {
			foundMatch
			playerOneName
			playerTwoName
		}
	}
`;
// const {
// 	data: match_data,
// 	error,
// 	loading,
// } = useSubscription(MATCH_FOUND, {
// variable for query, so username?
// variables: {
// 	user: "user1",
// }
// });
// useEffect(() => {
// 	if (match_data) {
// 		alert(match_data.playerOneName);
// 	}
// }, [match_data]);

function JoinQueue() {
	const [joinGlobalQueue, { data: queue_data, loading: queue_loading, error: queue_error }] =
		useMutation(JOIN_GLOBAL_QUEUE);

	// useEffect(() => {
	// 	if (queue_data) {
	// 		if (queue_data.joinGlobalQueue) {
	// 			// alert("found match!");
	// 			// `Match found! ${queue_data.joinGlobalQueue.playerOneName} vs ${queue_data.joinGlobalQueue.playerTwoName}`
	// 		} else {
	// 			// alert(`You were added to the queue!`);
	// 		}
	// 	}
	// }, [queue_data]);

	const handleClick = (event) => {
		event.preventDefault();

		const usern = event.target.elements.username.value; // placeholder usern moet eigenlijk de ingelogde unieke usernaam meegeven

		// dan zetten we username als de input van de mutation en callen we de mutation
		joinGlobalQueue({
			variables: {
				username: usern,
			},
		});
	};

	if (queue_data) {
		return <div> You are in the queue! </div>;
	} else {
		return (
			<form onSubmit={handleClick}>
				<input type="text" name="username" placeholder="Voor testing only" />
				<button type="submit">Join queue</button>
			</form>
		);
	}
}

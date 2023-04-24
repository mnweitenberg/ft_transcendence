import "src/styles/style.css";
import React from "react";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";

// const URL = "http://localhost:4242";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const socket = io(URL);

const MATCH_FOUND = gql`
	subscription {
		matchFound {
			foundMatch
			playerOneName
			playerTwoName
		}
	}
`;

export default function Queue(props: i.ModalProps) {
	useSubscription(MATCH_FOUND, {
		onSubscriptionData: ({ subscriptionData }) => {
			// newMatch zou match data van backend moeten ontvangen die correspondeert met GamerScore.
			//
			// voorzover ik zou denken is subscriptionData de return value van the subscription, (en dus een match),
			// al geven we hierboven in de MATCH_FOUND aan welke data terug komt (dit zou dan overeen moeten komen)
			// met de gamerscore.
			//
			// dus misschien gamerscore op backend na bootsen? zie interfaces.tsx voor gamerscore layout
			// score kan bijvoorbeeld altijd op 0 - 0

			const newMatch = subscriptionData.data.eventEmitter;
			queue.push(newMatch);
		},
	});

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
		joinGlobalQueue(username: $username) {
			foundMatch
			playerOneName
			playerTwoName
		}
	}
`;

function JoinQueue() {
	const [joinGlobalQueue, { data: queue_data }] = useMutation(JOIN_GLOBAL_QUEUE);

	useEffect(() => {
		if (queue_data) {
			if (queue_data.joinGlobalQueue.foundMatch) {
				alert(
					`Match found! ${queue_data.joinGlobalQueue.playerOneName} vs ${queue_data.joinGlobalQueue.playerTwoName}`
				);
			} else {
				alert(`You were added to the queue! ${queue_data.joinGlobalQueue.playerOneName}`);
			}
		}
	}, [queue_data]);

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

	return (
		<form onSubmit={handleClick}>
			<input type="text" name="username" placeholder="Voor testing only" />
			<button type="submit">Join queue</button>
		</form>
	);
}

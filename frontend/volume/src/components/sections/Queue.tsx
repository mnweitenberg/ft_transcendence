import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";
import { useRef } from "react";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { gql, useQuery, useMutation } from "@apollo/client";

// const URL = "http://localhost:4242";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const socket = io(URL);

export default function Queue(props: i.ModalProps) {
	// stuur req naar backend om alle GameScore structs te ontvangen
	// const rij: Array<i.GameScore> = [];

	// if (rij.length === 0) return <JoinQueue />;

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
			playerNameInQueue
		}
	}
`;

function JoinQueue() {
	const [joinGlobalQueue, data] = useMutation(JOIN_GLOBAL_QUEUE);
	// userName moet gebruikers naam van sessie oid krijgen
	const userName = "placeholder voor get_user_name";

	function handleClick() {
		// dan zetten we userName als de input van de mutation en callen we de mutation
		joinGlobalQueue({
			variables: {
				username: userName,
			},
		});
	}

	return <button onClick={handleClick}>Join queue</button>;
}

import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";
import * as i from "src/types/Interfaces";

export default function Queue(props: i.ModalProps) {
	if (queue.length === 0) return <JoinQueue />;

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

function JoinQueue() {
	return (
		<div className="join_queue">
			<a>+ join queue</a>
		</div>
	);
}

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:6565";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const socket = io(URL);

/**
 * Hook to listen for socket.io events
 * @param socket socket to apply event listener to
 * @param event event name to listen for
 * @param callback callback function that will be called when the event is received
 */
export function useSocketListener(
	socket: Socket,
	event: string,
	callback: (...args: any[]) => void
) {
	useEffect(() => {
		socket.on(event, callback);
		return () => {
			socket.off(event, callback);
		};
	}, []);
}

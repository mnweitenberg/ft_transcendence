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

import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:4242");

function JoinQueue() {
	function handleClick() {
		// alert("button clicked!");

		socket.emit('findMatch', { "placeholder voor userId" }, (data: any) => );
	}

	return (
		<button onClick={handleClick}>Join queue</button>
		// <div className="join_queue">
		// 	<a>+ join queue</a>
		// </div>
	);
}

// export function Button() {
// 	return <button>Join queue</button>;
// }

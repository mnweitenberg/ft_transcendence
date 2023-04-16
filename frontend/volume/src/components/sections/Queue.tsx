import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import { queue } from "src/utils/data";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:4242";

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
	function handleClick() {
		// const socket = io("http://localhost:4500"); // should correspond with port from backend @WebSocketGateway, zie queue.gateway.ts
		// socket.emit("test", "placeholder voor userId");

		socket.emit("test", "hallo van front");
		// useSocketListener(socket, "message_received", (data: any) => {});

		alert("button clicked!");
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
// setup websockets to communicate with my backend

// import { io } from "socket.io-client";

// const socket = io("http://localhost:4243");

// socket.on("connect", () => {
// 	console.log("connected");
// });

// socket.on("disconnect", () => {
// 	console.log("disconnected");
// });

// socket.on("test", (data) => {
// 	console.log(data);
// });

// socket.emit("test", "placeholder voor userId");

// socket.emit("join", { room: "chat" });

// socket.on("join", (data) => {
// 	console.log(data);
// });

// socket.on("leave", (data) => {
// 	console.log(data);
// });

// socket.on("message", (data) => {
// 	console.log(data);
// });

// socket.on("roomData", (data) => {
// 	console.log(data);
// });

// socket.on("gameData", (data) => {
// 	console.log(data);
// });

// socket.on("gameOver", (data) => {
// 	console.log(data);
// });

// socket.on("gameStart", (data) => {
// 	console.log(data);
// });

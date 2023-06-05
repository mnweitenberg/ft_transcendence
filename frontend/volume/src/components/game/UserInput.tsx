import * as i from "../../types/Interfaces";
import p5Types from "p5";
import SocketSingleton from "../../utils/socketSingleton";
import { gql, useQuery } from "@apollo/client";

// const USERID = gql`
// 	query currentUserQuery {
// 		currentUserQuery {
// 			id
// 		}
// 	}
// `;

// function useUserId() {
// 	const { loading, error, data } = useQuery(USERID);
// 	let id = "";

// 	if (loading) return id;
// 	if (error && error.message != "Unauthorized") return id;
// 	else if (error) {
// 		console.log(error.message);
// 	} else id = data.currentUserQuery.id;
// 	console.log(id);
// 	return id;
// }

const id = "d18621e6-46a6-4df1-b30f-4b24c8fa6b34";

export function startNewGame() {
	// const id = useUserId();
	const socketSingleton = SocketSingleton.getInstance();
	socketSingleton.socket.emit("startNewGame", { id: id });
}

export function handleUserInput(canvas: i.Canvas, p5: p5Types) {
	// const id = useUserId();
	const socketSingleton = SocketSingleton.getInstance();
	sendMouseY(canvas, p5, socketSingleton, id);
	sendMouseClick(p5, socketSingleton, id);
	handlePaddleSizeChange(p5, socketSingleton, id);
}

function sendMouseY(canvas: i.Canvas, p5: p5Types, socketSingleton: SocketSingleton, id: string) {
	let relativeMouseY = p5.mouseY / canvas.height;
	relativeMouseY = clamp(relativeMouseY, 0, 1);
	socketSingleton.socket.emit("PaddlePosition", { id: id, mouseY: relativeMouseY });
}

function sendMouseClick(p5: p5Types, socketSingleton: SocketSingleton, id: string) {
	if (p5.mouseIsPressed) socketSingleton.socket.emit("mouseClick", { id: id });
}

let isUpArrowPressed = false;
let isDownArrowPressed = false;

function handlePaddleSizeChange(p5: p5Types, socketSingleton: SocketSingleton, id: string) {
	if (p5.key === "=" && !isUpArrowPressed) {
		isUpArrowPressed = true;
		socketSingleton.socket.emit("enlargePaddle", { id: id });
	}
	if (p5.key === "-" && !isDownArrowPressed) {
		isDownArrowPressed = true;
		socketSingleton.socket.emit("reducePaddle", { id: id });
	}

	p5.keyReleased = () => {
		if (p5.key === "=") isUpArrowPressed = false;
		if (p5.key === "-") isDownArrowPressed = false;
	};
}

function clamp(num: number, min: number, max: number): number {
	return num <= min ? min : num >= max ? max : num;
}

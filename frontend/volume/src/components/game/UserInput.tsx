import * as i from "../../types/Interfaces";
import p5Types from "p5";
import SocketSingleton from "../../utils/socketSingleton";

const id = "1ed22af1-292b-4aca-8d5d-1024a410693c";

export function startNewGame() {
	const socketSingleton = SocketSingleton.getInstance();
	socketSingleton.socket.emit("startNewGame", { id: id });
}

export function handleUserInput(canvas: i.Canvas, p5: p5Types) {
	const socketSingleton = SocketSingleton.getInstance();
	sendMouseY(canvas, p5, socketSingleton);
	sendMouseClick(p5, socketSingleton);
	handlePaddleSizeChange(p5, socketSingleton);
}

function sendMouseY(canvas: i.Canvas, p5: p5Types, socketSingleton: SocketSingleton) {
	let relativeMouseY = p5.mouseY / canvas.height;
	relativeMouseY = clamp(relativeMouseY, 0, 1);
	socketSingleton.socket.emit("PaddlePosition", { id: id, mouseY: relativeMouseY });
}

function sendMouseClick(p5: p5Types, socketSingleton: SocketSingleton) {
	if (p5.mouseIsPressed) socketSingleton.socket.emit("mouseClick", { id: id });
}

let isUpArrowPressed = false;
let isDownArrowPressed = false;

function handlePaddleSizeChange(p5: p5Types, socketSingleton: SocketSingleton) {
	if (p5.key === "=" && !isUpArrowPressed) {
		isUpArrowPressed = true;
		socketSingleton.socket.emit("enlargePaddle", { id: id });
	}
	if (p5.key === "-" && !isDownArrowPressed) {
		isDownArrowPressed = true;
		socketSingleton.socket.emit("reducePaddle", { id: id });
	}

	p5.keyReleased = () => {
		if (p5.key === "=") {
			isUpArrowPressed = false;
		}
		if (p5.key === "-") {
			isDownArrowPressed = false;
		}
	};
}

function clamp(num: number, min: number, max: number): number {
	return num <= min ? min : num >= max ? max : num;
}

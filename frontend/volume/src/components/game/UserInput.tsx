import * as i from "../../types/Interfaces";
import p5Types from "p5";
import SocketSingleton from "../../utils/socketSingleton";

export function handleMouseInput(canvas: i.Canvas, p5: p5Types, state: i.GameState) {
	const socketSingleton = SocketSingleton.getInstance();
	const sendMouseY = (mouseY: number) => {
		socketSingleton.socket.emit("sendMouseY", { mouseY });
	};

	const sendMouseClick = (mouseClick: boolean) => {
		socketSingleton.socket.emit("mouseClick", { mouseClick });
	};

	// state.paddleRight.y = p5.mouseY;
	// sendMouseY(p5.mouseY);

	// Call the sendMouseY function with the p5.mouseY value
	let relativeMouseY = p5.mouseY / canvas.height;
	if (relativeMouseY < 0) relativeMouseY = 0;
	if (relativeMouseY > 1) relativeMouseY = 1;
	sendMouseY(relativeMouseY);

	// Call the sendMouseClick function with the p5.mouseIsPressed value
	sendMouseClick(p5.mouseIsPressed);
}

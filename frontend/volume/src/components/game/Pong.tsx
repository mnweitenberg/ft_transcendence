import { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import * as CPU from "./CPU";
import { drawItems } from "./DrawItems";
import { handleCollisions, handleScore } from "./PongLogic";
import { handleMouseInput } from "./UserInput";
import { initCanvas, initializeGameState } from "./PongInit";

export default function Pong(props: any) {
	if (!document.getElementById("game") || document.getElementById("game") === undefined)
		return <>Game element not found</>;

	const canvas = initCanvas(document.getElementById("game")?.clientWidth);
	const [state, setState] = useState(() => initializeGameState(canvas));

	// useEffect(() => {
	// 	const socketSingleton = SocketSingleton.getInstance();
	// 	socketSingleton.socket.on("gameState", (gameState: i.GameState) => {
	// 		gameState.canvasHeight = state.canvasHeight;
	// 		gameState.canvasWidth = state.canvasWidth;
	// 		gameState.paddleRight.x *= state.canvasHeight;
	// 		console.log(gameState.paddleRight.x);
	// 		setState(gameState);
	// 	});
	// }, []);

	// resizeCanvasOnBrowserResize(state, props.gameScore);

	function setupCanvas(p5: p5Types, canvasParentRef: Element) {
		p5.createCanvas(canvasParentRef.clientWidth, canvasParentRef.clientHeight, "p2d").parent(
			canvasParentRef
		);
	}

	function drawCanvas(p5: p5Types) {
		drawItems(canvas, p5, state);
		handleMouseInput(canvas, p5, state);
		CPU.Action(state);
		handleCollisions(canvas, state);
		handleScore(canvas, state, props);
	}

	function handleMouseClick() {
		state.started = true;
		if (state.serveRight.state) state.ball.xSpeed = state.ball.defaultSpeed * -1;
		state.serveRight.state = false;
	}
	return <Sketch setup={setupCanvas} draw={drawCanvas} mouseClicked={handleMouseClick} />;
}

// function resizeCanvasOnBrowserResize(state: i.GameState, gameScore: i.GameScore) {
// 	window.addEventListener("resize", () => {
// 		state = initializeGameState(gameScore, document.getElementById("game"));
// 	});
// }

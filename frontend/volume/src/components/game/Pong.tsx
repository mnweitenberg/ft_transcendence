import { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import * as CPU from "./CPU";
import * as i from "../../types/Interfaces";
import { drawItems } from "./DrawItems";
import { handleCollisions } from "./Collision";
import { handleMouseInput } from "./UserInput";
import SocketSingleton from "../../utils/socketSingleton";

export default function PongComponent(props: any) {
	if (!document.getElementById("game")) return <>Game element not found</>;

	const [state, setState] = useState(() => initializeGameState(document.getElementById("game")));

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
		handleMouseInput(p5, state);
		drawItems(p5, state);
		handleCollisions(state, props);
		CPU.Action(state);
	}

	function handleMouseClick() {
		state.started = true;
		if (state.serveLeft.state) state.ball.xSpeed = Math.abs(state.ball.xSpeed);
		if (state.serveRight.state) state.ball.xSpeed = Math.abs(state.ball.xSpeed) * -1;
		state.serveLeft.state = false;
		state.serveRight.state = false;
	}
	return <Sketch setup={setupCanvas} draw={drawCanvas} mouseClicked={handleMouseClick} />;
}

function initializeGameState(parentElement: Element | null): i.GameState {
	if (!parentElement) throw new Error("parentElement is null");

	const canvasHeight = parentElement.clientWidth / 2;
	const paddleHeight = canvasHeight / 5;
	const paddleWidth = paddleHeight / 10;
	const ballDiameter = paddleWidth * 2;
	const ballSpeed = ballDiameter;
	const borderOffset = paddleWidth / 2;

	const paddleLeft: i.Paddle = {
		x: borderOffset,
		y: canvasHeight / 2,
		height: paddleHeight,
		width: paddleWidth,
	};

	const paddleRight: i.Paddle = {
		x: parentElement.clientWidth - borderOffset - paddleWidth,
		y: canvasHeight / 2,
		height: paddleHeight,
		width: paddleWidth,
	};

	const serveLeft: i.ServeState = {
		state: false,
		x: paddleLeft.x + paddleWidth + ballDiameter / 2,
		y: paddleLeft.y + 0.5 * paddleHeight,
	};

	const serveRight: i.ServeState = {
		state: false,
		x: paddleRight.x - ballDiameter / 2,
		y: paddleRight.y + 0.5 * paddleHeight,
	};

	const ball: i.Ball = {
		x: serveRight.x,
		y: paddleRight.y + paddleHeight / 2,
		xSpeed: ballSpeed,
		ySpeed: ballSpeed,
		defaultSpeed: ballSpeed,
		diameter: ballDiameter,
	};

	const state: i.GameState = {
		started: false,
		canvasHeight: canvasHeight,
		canvasWidth: parentElement.clientWidth,
		paddleLeft,
		paddleRight,
		serveLeft,
		serveRight,
		ball,
		borderOffset: borderOffset,
	};

	return state;
}

// function resizeCanvasOnBrowserResize(state: i.GameState, gameScore: i.GameScore) {
// 	window.addEventListener("resize", () => {
// 		state = initializeGameState(gameScore, document.getElementById("game"));
// 	});
// }

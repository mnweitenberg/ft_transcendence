import { useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import * as C from "../../utils/constants";
import * as CPU from "./CPU";
import * as i from "../../types/Interfaces";
import { drawItems } from "./DrawItems";
import { handleCollisions } from "./Collision";
import { handleMouseInput } from "./UserInput";

export default function PongComponent(props: any) {
	if (!document.getElementById("game")) return <>Game element not found</>;

	const [state, setState] = useState(() =>
		initializeGameState(props.gameScore, document.getElementById("game"))
	);

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

function initializeGameState(gameScore: i.GameScore, parentElement: Element | null): i.GameState {
	if (!parentElement) throw new Error("parentElement is null");

	const paddleLeft: i.Paddle = {
		x: C.BORDER_OFFSET,
		y: parentElement.clientHeight / 2,
	};

	const paddleRight: i.Paddle = {
		x: parentElement.clientWidth - C.BORDER_OFFSET - C.PADDLE_WIDTH,
		y: parentElement.clientHeight / 2,
	};

	const serveLeft: i.ServeState = {
		state: false,
		x: paddleLeft.x + C.PADDLE_WIDTH + C.BALL_DIAMETER / 2,
		y: paddleLeft.y + 0.5 * C.PADDLE_HEIGHT,
	};

	const serveRight: i.ServeState = {
		state: false,
		x: paddleRight.x - C.BALL_DIAMETER / 2,
		y: paddleRight.y + 0.5 * C.PADDLE_HEIGHT,
	};

	const ball: i.Ball = {
		x: serveLeft.x,
		y: paddleLeft.y + C.PADDLE_HEIGHT / 2,
		xSpeed: C.DEFAULT_BALL_SPEED,
		ySpeed: C.DEFAULT_BALL_SPEED,
	};

	const state: i.GameState = {
		started: false,
		canvasHeight: parentElement.clientHeight,
		canvasWidth: parentElement.clientWidth,
		paddleLeft,
		paddleRight,
		serveLeft,
		serveRight,
		ball,
	};

	return state;
}

// function resizeCanvasOnBrowserResize(state: i.GameState, gameScore: i.GameScore) {
// 	window.addEventListener("resize", () => {
// 		state = initializeGameState(gameScore, document.getElementById("game"));
// 	});
// }

import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import Game from './Game';
import * as CONST from "../Defines/Constants";
import * as CPU from "./CPU";
import * as i from "../Defines/Interfaces"
import { drawItems } from "./DrawItems";
import { handleCollisions } from "./Collision";
import { handleMouseInput } from "./UserInput";

function initializeGameState(gameScore: i.GameScore, parentElement: Element | null) : i.GameState{
	if (!parentElement)
		throw new Error("parentElement is null");

	let paddleLeft: i.Paddle = {
		x: CONST.BORDER_OFFSET,
		y: parentElement.clientHeight / 2,
	}

	let paddleRight: i.Paddle = {
		x: parentElement.clientWidth - CONST.BORDER_OFFSET - CONST.PADDLE_WIDTH,
		y: parentElement.clientHeight / 2,
	}

	let serveLeft: i.ServeState = {
		state: false,
		x: paddleLeft.x + CONST.PADDLE_WIDTH + CONST.BALL_DIAMETER/2,
		y: paddleLeft.y + (0.5 * CONST.PADDLE_HEIGHT),
	}

	let serveRight: i.ServeState = {
		state: false,
		x: paddleRight.x - CONST.BALL_DIAMETER/2,
		y: paddleRight.y + (0.5 * CONST.PADDLE_HEIGHT),
	}

	let ball: i.Ball = {
		x: serveLeft.x,
		y: paddleLeft.y + CONST.PADDLE_HEIGHT / 2,
		xSpeed: CONST.DEFAULT_BALL_SPEED,
		ySpeed: CONST.DEFAULT_BALL_SPEED
	};

	let state: i.GameState = {
		started: false,
		canvasHeight: parentElement.clientHeight,
		canvasWidth: parentElement.clientWidth,
		paddleLeft: paddleLeft,
		paddleRight: paddleRight,
		serveLeft: serveLeft,
		serveRight:  serveRight,
		ball: ball,
		score: gameScore,
	}

	return state;
}

function resizeCanvasOnBrowserResize(state: i.GameState, gameScore: i.GameScore) {
	window.addEventListener("resize", () => {
		state = initializeGameState(gameScore, document.getElementById("game"));
	});
}

function PongComponent( props: any ) {
	if (!document.getElementById("game"))
		return(<>Game element not found</>);
	let state: i.GameState = initializeGameState(props.gameScore, document.getElementById("game"));

	resizeCanvasOnBrowserResize(state, props.gameScore);
	
	function setupCanvas (p5: p5Types, canvasParentRef: Element) {
		p5.createCanvas(canvasParentRef.clientWidth, canvasParentRef.clientHeight, "p2d").parent(canvasParentRef);
	};

	function drawCanvas (p5: p5Types) {
		drawItems(p5, state);
		handleCollisions(state, props);
 		handleMouseInput(p5.mouseY, state);
		CPU.Action(state);
	};

	function handleKeyPress (e: any) {
		if (e.keyCode === CONST.ESC)
			props.setGotToMenu(true);

		if (e.keyCode === CONST.SPACEBAR) {
			state.started = true;
			if (state.serveLeft)
				state.ball.xSpeed = Math.abs(state.ball.xSpeed);
			if (state.serveRight) 
				state.ball.xSpeed = Math.abs(state.ball.xSpeed) * -1;
			state.serveLeft.state = false;
			state.serveRight.state = false;
		}
	}

	return (<Sketch setup={setupCanvas} draw={drawCanvas} keyPressed={handleKeyPress}/>);
};

export default PongComponent;

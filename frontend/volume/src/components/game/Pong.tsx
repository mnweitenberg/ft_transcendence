import { useState, useEffect, useRef } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { drawItems } from "./DrawItems";
import { handleUserInput } from "./UserInput";
import { initCanvas, initializeGameState } from "./PongInit";
import * as i from "../../types/Interfaces";
import SocketSingleton from "../../utils/socketSingleton";

function useGameSocket(initialGameState: i.GameState) {
	const [state, setState] = useState(() => initialGameState);

	useEffect(() => {
		const socketSingleton = SocketSingleton.getInstance();
		socketSingleton.socket.on("gameState", (gameState: i.GameState) => {
			console.log(gameState.p2.paddle.x, gameState.p2.paddle.y, gameState.p2.paddle.height);
			// console.log(gameState.ball.x, gameState.ball.y);
			setState(gameState);
		});
	}, []);

	return state;
}

function useWindowResize(
	p5: React.MutableRefObject<p5Types | null>,
	canvasSetter: (canvas: i.Canvas) => void
) {
	useEffect(() => {
		const handleResize = () => {
			const gameElement = document.getElementById("game");
			if (gameElement && p5.current) {
				const newWidth = gameElement.clientWidth;
				const newHeight = newWidth / 2;
				canvasSetter(initCanvas(newWidth));
				p5.current.resizeCanvas(newWidth, newHeight);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
}

export default function Pong() {
	if (!document.getElementById("game") || document.getElementById("game") === undefined)
		return <h1>Game element not found</h1>;

	const [canvas, setCanvas] = useState(initCanvas(document.getElementById("game")?.clientWidth));
	const state = useGameSocket(initializeGameState(canvas));

	const p5Ref = useRef<p5Types | null>(null);
	useWindowResize(p5Ref, setCanvas);

	function setupCanvas(p5: p5Types, canvasParentRef: Element) {
		p5Ref.current = p5;
		p5.createCanvas(canvasParentRef.clientWidth, canvasParentRef.clientHeight, "p2d").parent(
			canvasParentRef
		);
	}

	function drawCanvas(p5: p5Types) {
		drawItems(canvas, p5, state);
		handleUserInput(canvas, p5);
	}

	return <Sketch setup={setupCanvas} draw={drawCanvas} />;
}

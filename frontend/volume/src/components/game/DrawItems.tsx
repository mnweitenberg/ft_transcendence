import p5Types from "p5";
import * as i from "../../types/Interfaces";

enum color {
	background,
	main,
	accent,
}
export const MIDDLE_LINE_WIDTH = 16;

export function drawItems(canvas: i.Canvas, p5: p5Types, state: i.GameState) {
	p5.background(keyPressed(p5, color.background));
	drawMiddleLine(canvas, p5);

	const paddleLeft: i.Paddle = {
		x: canvas.borderOffset,
		y: state.p1.paddle.y * canvas.height,
		height: state.p1.paddle.height * canvas.height,
	};
	drawPaddle(canvas, p5, paddleLeft);

	const paddleRight: i.Paddle = {
		x: canvas.width - canvas.borderOffset - canvas.paddleWidth,
		y: state.p2.paddle.y * canvas.height,
		height: state.p2.paddle.height * canvas.height,
	};
	drawPaddle(canvas, p5, paddleRight);

	drawBall(p5, canvas, state);
}

function drawPaddle(canvas: i.Canvas, p5: p5Types, paddle: i.Paddle): void {
	p5.fill(keyPressed(p5, color.main));
	p5.noStroke();
	p5.rect(paddle.x, paddle.y, canvas.paddleWidth, paddle.height);
}

function drawMiddleLine(canvas: i.Canvas, p5: p5Types): void {
	p5.fill(keyPressed(p5, color.accent));
	p5.noStroke();
	p5.rect((canvas.width - MIDDLE_LINE_WIDTH) / 2, 0, MIDDLE_LINE_WIDTH / 2, canvas.height);
}

function drawBall(p5: p5Types, canvas: i.Canvas, state: i.GameState): void {
	const ballX = state.ball.x * canvas.height;
	const ballY = state.ball.y * canvas.height;

	p5.fill(keyPressed(p5, color.main));
	p5.ellipse(ballX, ballY, canvas.ballDiameter, canvas.ballDiameter);
}

const white = [245, 245, 245];
const lightGrey = [200, 200, 200];
const darkGrey = [50, 50, 50];
const black = [10, 10, 10];

let colorScheme = [black, white, darkGrey];

function keyPressed(p5: p5Types, color: number) {
	if (p5.key === "w") colorScheme = [white, black, lightGrey];
	if (p5.key === "b") colorScheme = [black, white, darkGrey];
	return colorScheme[color];
}

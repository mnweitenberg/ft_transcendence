import p5Types from "p5";
import * as C from "../../utils/constants";
import * as i from "../../types/Interfaces";

enum color {
	background,
	main,
	accent,
}

export function drawItems(canvas: i.Canvas, p5: p5Types, state: i.GameState) {
	const paddleLeft: i.Paddle = {
		x: canvas.borderOffset,
		y: state.paddleLeft.y * canvas.height,
		height: state.paddleLeft.height * canvas.height,
	};

	const paddleRight: i.Paddle = {
		x: canvas.width - canvas.borderOffset - canvas.paddleWidth,
		y: state.paddleRight.y * canvas.height,
		height: state.paddleRight.height * canvas.height,
	};

	const ball: i.Ball = {
		x: state.ball.x * canvas.height,
		y: state.ball.y * canvas.height,
	};

	p5.background(keyPressed(p5, color.background));
	drawPaddle(canvas, p5, paddleLeft);
	drawPaddle(canvas, p5, paddleRight);
	drawMiddleLine(canvas, p5);
	drawBall(canvas, p5, ball);
}

function drawPaddle(canvas: i.Canvas, p5: p5Types, paddle: i.Paddle): void {
	p5.fill(keyPressed(p5, color.main));
	p5.noStroke();
	p5.rect(paddle.x, paddle.y, canvas.paddleWidth, paddle.height);
}

function drawMiddleLine(canvas: i.Canvas, p5: p5Types): void {
	p5.fill(keyPressed(p5, color.accent));
	p5.noStroke();
	p5.rect((canvas.width - C.MIDDLE_LINE_WIDTH) / 2, 0, C.MIDDLE_LINE_WIDTH / 2, canvas.height);
}

function drawBall(canvas: i.Canvas, p5: p5Types, ball: i.Ball): void {
	p5.fill(keyPressed(p5, color.main));
	p5.ellipse(ball.x, ball.y, canvas.ballDiameter, canvas.ballDiameter);
}

function keyPressed(p5: p5Types, color: number) {
	let colorScheme = [
		[10, 10, 10],
		[245, 245, 245],
		[50, 50, 50],
	];

	if (p5.key === "w") {
		colorScheme = [
			[245, 245, 245],
			[10, 10, 10],
			[200, 200, 200],
		];
	} else if (p5.key === "b") {
		colorScheme = [
			[10, 10, 10],
			[245, 245, 245],
			[50, 50, 50],
		];
	}
	return colorScheme[color];
}

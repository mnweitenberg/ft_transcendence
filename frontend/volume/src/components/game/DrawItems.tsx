import p5Types from "p5";
import * as C from "../../utils/constants";
import * as i from "../../types/Interfaces";

export function drawItems(canvas: i.Canvas, p5: p5Types, state: i.GameState) {
	const paddleLeft: i.Paddle = {
		x: canvas.borderOffset,
		y: state.paddleLeft.y * canvas.height,
	};

	const paddleRight: i.Paddle = {
		x: canvas.width - canvas.borderOffset - canvas.paddleWidth,
		y: state.paddleRight.y * canvas.height,
	};

	const ball: i.Ball = {
		x: state.ball.x * canvas.height,
		y: state.ball.y * canvas.height,
		xSpeed: state.ball.xSpeed * canvas.ballDiameter,
		ySpeed: state.ball.ySpeed * canvas.ballDiameter,
		defaultSpeed: state.ball.defaultSpeed * canvas.ballDiameter,
	};

	p5.background(0, 0, 0);
	drawPaddle(canvas, p5, paddleLeft);
	drawPaddle(canvas, p5, paddleRight);
	drawMiddleLine(canvas, p5);
	drawBall(canvas, p5, ball);
}

function drawPaddle(canvas: i.Canvas, p5: p5Types, paddle: i.Paddle): void {
	p5.fill(255, 255, 255);
	p5.noStroke();
	p5.rect(paddle.x, paddle.y, canvas.paddleWidth, canvas.paddleHeight);
}

function drawMiddleLine(canvas: i.Canvas, p5: p5Types): void {
	p5.fill(56, 56, 56);
	p5.noStroke();
	p5.rect((canvas.width - C.MIDDLE_LINE_WIDTH) / 2, 0, C.MIDDLE_LINE_WIDTH / 2, canvas.height);
}

function drawBall(canvas: i.Canvas, p5: p5Types, ball: i.Ball): void {
	p5.fill(255, 255, 255);
	p5.ellipse(ball.x, ball.y, canvas.ballDiameter, canvas.ballDiameter);
}

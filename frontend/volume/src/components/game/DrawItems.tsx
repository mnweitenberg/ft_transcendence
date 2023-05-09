import p5Types from "p5";
import * as C from "../../utils/constants";
import * as i from "../../types/Interfaces";

export function drawItems(canvas: i.Canvas, p5: p5Types, state: i.GameState) {
	p5.background(0, 0, 0);
	drawPaddle(canvas, p5, state.paddleLeft);
	drawPaddle(canvas, p5, state.paddleRight);
	drawMiddleLine(canvas, p5, state);
	drawBall(canvas, p5, state.ball);
}

function drawPaddle(canvas: i.Canvas, p5: p5Types, paddle: i.Paddle): void {
	p5.fill(255, 255, 255);
	p5.noStroke();
	p5.rect(paddle.x, paddle.y, canvas.paddleWidth, canvas.paddleHeight);
}

function drawMiddleLine(canvas: i.Canvas, p5: p5Types, state: i.GameState): void {
	p5.fill(56, 56, 56);
	p5.noStroke();
	p5.rect((canvas.width - C.MIDDLE_LINE_WIDTH) / 2, 0, C.MIDDLE_LINE_WIDTH / 2, canvas.height);
}

function drawBall(canvas: i.Canvas, p5: p5Types, ball: i.Ball): void {
	p5.fill(255, 255, 255);
	p5.ellipse(ball.x, ball.y, canvas.ballDiameter, canvas.ballDiameter);
}

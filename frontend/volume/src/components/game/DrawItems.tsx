import p5Types from "p5";
import * as C from "../../utils/constants";
import * as i from "../../types/Interfaces";

export function drawItems(p5: p5Types, state: i.GameState) {
	p5.background(0, 0, 0);
	drawPaddle(p5, state.paddleLeft);
	drawPaddle(p5, state.paddleRight);
	drawMiddleLine(p5, state);
	drawBall(p5, state.ball);
}

function drawPaddle(p5: p5Types, paddle: i.Paddle): void {
	p5.fill(255, 255, 255);
	p5.noStroke();
	p5.rect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawMiddleLine(p5: p5Types, state: i.GameState): void {
	p5.fill(56, 56, 56);
	p5.noStroke();
	p5.rect(
		(state.canvasWidth - C.MIDDLE_LINE_WIDTH) / 2,
		0,
		C.MIDDLE_LINE_WIDTH / 2,
		state.canvasHeight
	);
}

function drawBall(p5: p5Types, ball: i.Ball): void {
	p5.fill(255, 255, 255);
	p5.ellipse(ball.x, ball.y, ball.diameter, ball.diameter);
}

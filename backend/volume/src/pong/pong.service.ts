import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {
	handleMouseYUpdate(mouseY: number): void {
		console.log('Mouse Y position updated:', mouseY);
		// Handle mouseY update, e.g., update the paddle position
	}
}

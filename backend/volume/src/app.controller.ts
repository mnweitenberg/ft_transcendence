import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		console.log('main page');
		return this.appService.getHello();
	}

	@Get('callback')
	async callback(@Res({ passthrough: true }) response: Response) {
		response.cookie('session_cookie', 'yeet');
		response.status(200).redirect('http://localhost:5574/loading');
		// return 'hello';
	}
}

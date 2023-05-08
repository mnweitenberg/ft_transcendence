import { Controller, Get, createParamDecorator } from '@nestjs/common';
import { AuthService, IntraToken } from './auth.service';
import { Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { ExecutionContext } from '@nestjs/common';

interface User {}

// const ReqCode = createParamDecorator((data: string, ctx: ExecutionContext) => {
// 	const request = ctx.switchToHttp().getRequest();
// 	console.log(request.qu
// 	return request;
// });

@Controller('callback')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	async callback(
		@Res({ passthrough: true }) response: Response,
		@Req() request: Request,
	) {
		const intraToken: IntraToken =
			await this.authService.exchangeCodeForToken(
				JSON.stringify(request.query),
			);
		// add instance of user to database

		// const JwtCookie = this.authService.getJwtCookie();
		const JwtCookie = null;
		response.setHeader('Set-Cookie', JwtCookie);
		response.cookie('session_cookie', 'yeet');
		response.status(200).redirect('http://localhost:5574/loading');
	}
}

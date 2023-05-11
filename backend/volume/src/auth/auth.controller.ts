import { Controller, Get, createParamDecorator } from '@nestjs/common';
import { AuthService, IntraToken } from './auth.service';
import { Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { ExecutionContext } from '@nestjs/common';

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
		const userInfo = await this.authService.linkTokenToUser(intraToken);
		const jwtCookie = await this.authService.getJwtCookie(userInfo);
		response.setHeader(
			'Set-Cookie',
			'session_cookie=' + jwtCookie + '; HttpOnly; Secure; SameSite=Lax',
		);
		response.status(200).redirect('http://localhost:5574/');
	}
}

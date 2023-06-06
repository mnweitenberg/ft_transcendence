import { ExecutionContext, Headers, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return (ctx.getContext().req) ? ctx.getContext().req : null;
	}
}

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') {
	constructor(private readonly jwtService: JwtService) {super();}

	getRequest(context: ExecutionContext) {
		const socket: Socket = context.switchToWs().getClient<Socket>();
		const request = socket.request;
		return request;
	}

	async canActivate(context: ExecutionContext) {
		const request = this.getRequest(context);
		const token = extractJwtToken(request.headers.cookie);
		try {
			// console.log('Verifying token:', token);
			// console.log('Current system time:', new Date());
			const payload = await this.jwtService.verifyAsync(token);
			// console.log(payload);
			if (!payload) return false;
			// console.log(context.switchToHttp().getRequest().user = payload);
			context.switchToHttp().getRequest().user = payload;
		} catch (error) {
			console.error('Error occurred while verifying token:', error);
			return false;
		}
		return true;
	}
}

function extractJwtToken(cookieString: string): string | null {
	const cookieRegex = /session_cookie=({[^;]*})/;
	const cookieMatch = cookieString.match(cookieRegex);
	if (cookieMatch && cookieMatch.length > 1) {
		const sessionCookie = cookieMatch[1];

		let sessionObject: any;
		try {
			sessionObject = JSON.parse(decodeURIComponent(sessionCookie));
		} catch (error) {
			console.error('Error occurred while parsing session cookie:', error);
		return null;
		}

		return sessionObject.access_token || null;
	}

	return null;
}
  
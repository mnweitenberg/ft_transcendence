import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req ? ctx.getContext().req : null;
	}
}

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') {
	constructor(private readonly jwtService: JwtService) {
		super();
	}

	getRequest(context: ExecutionContext) {
		const socket: Socket = context.switchToWs().getClient<Socket>();
		const request = socket.request;
		return request;
	}

	async canActivate(context: ExecutionContext) {
		const request = this.getRequest(context);
		const token = this.extractJwtToken(request.headers.cookie);
		try {
			const payload = await this.jwtService.verifyAsync(token);
			if (!payload) return false;
			context.switchToHttp().getRequest().user = payload;
			context.switchToWs().getClient().user = payload;
		} catch (error) {
			console.error('Error: verifying token:', error);
			return false;
		}
		return true;
	}

	private extractJwtToken(cookieString: string): string | null {
		const cookieRegex = /session_cookie=({[^;]*})/;
		const cookieMatch = cookieString.match(cookieRegex);
		if (cookieMatch && cookieMatch.length > 1) {
			const sessionCookie = cookieMatch[1];

			let sessionObject: any;
			try {
				sessionObject = JSON.parse(decodeURIComponent(sessionCookie));
			} catch (error) {
				console.error('Error: parsing session cookie:', error);
				return null;
			}
			return sessionObject.access_token || null;
		}
		return null;
	}
}

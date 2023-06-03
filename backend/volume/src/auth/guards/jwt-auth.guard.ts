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
	const token = extractJwtToken(request.headers.cookie);
    const payload = await this.jwtService.verifyAsync(token);
    if (!payload) return false;
    context.switchToHttp().getRequest().user = payload;
    return true;
  }
}

function extractJwtToken(cookieString: string): string | null {
	const tokenRegex = /"access_token":"([^"]+)"/;
	const match = cookieString.match(tokenRegex);
  	if (match && match.length > 1) return match[1];
	return null;
  }
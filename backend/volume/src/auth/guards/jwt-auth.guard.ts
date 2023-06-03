import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
	// console.log('WsJwtGuard');
    const client: Socket = context.switchToWs().getClient();

	// if (client.handshake.headers) console.log('headers found');
	// else console.log('no headers');

	const authHeader = client.handshake.headers.authorization;

	if (authHeader) console.log('authHeader found');
	else console.log('no authHeader');

	if (!authHeader) throw new WsException('No credentials provided');

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer') throw new WsException('Invalid credentials');
    if (!token) throw new WsException('No token provided');

	try {
		const payload = this.jwtService.verify(token);
		// client.user = payload;
		context.switchToWs().getData().user = payload;
		console.log(context.switchToWs().getData().user);
	} catch (err) {
		console.log(err);
		throw new WsException('Invalid token');
	}

    return true;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		console.log('getRequest');
		const ctx = GqlExecutionContext.create(context);
		console.log('ctx', ctx);
		return ctx.getContext().req;
	}
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWTFromHttpOrWs]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	private static extractJWTFromHttpOrWs(request): string | null {
		// console.log('Extracting JWT from HTTP request or websocket query parameter');
		// Check for JWT in HTTP cookie
		if (request.cookies && request.cookies['session_cookie']) {
			// console.log('Found JWT in HTTP cookie');
			return JSON.parse(request.cookies['session_cookie']).access_token;
		}
		// Check for JWT in websocket query parameter
		else if (request.handshake && request.handshake.query && request.handshake.query['token']) {
			// console.log('Found JWT in websocket query parameter');
			return request.handshake.query['token'];
		}
		return null;
	}

	async validate(payload: any) {
		// console.log(payload);
		return payload;
	}
}


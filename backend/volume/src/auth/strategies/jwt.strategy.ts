import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJWTFromHttpOrWs,
			]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	private static extractJWTFromHttpOrWs(request): string | null {
		if (request.cookies && request.cookies['session_cookie'])
			return JSON.parse(request.cookies['session_cookie']).access_token;
		else if (
			request.handshake &&
			request.handshake.query &&
			request.handshake.query['token']
		)
			return request.handshake.query['token'];
		return null;
	}

	async validate(payload: any) {
		return payload;
	}
}

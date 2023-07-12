import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenType } from '../user-info.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	private static extractJWT(request: any): string | null {
		if (request.cookies && request.cookies['session_cookie']) {
			let jwtString: string;
			try {
				jwtString = JSON.parse(request.cookies['session_cookie']).access_token;
			} catch (e) {
				return null;
			}
			return jwtString;
		}
		return null;
	}

	async validate(payload: any) {
		console.log(payload);
		if (
			(Date.now() / 1000) >= payload.exp
			|| payload.type == TokenType.PARTIAL
		) {
			throw new UnauthorizedException("Expired token");
		}
		return payload;
	}
}

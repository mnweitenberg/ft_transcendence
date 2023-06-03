import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserInfo } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	private static extractJWT(req: Request): string | null {
		const cookieName = 'session_cookie';

		if (req.cookies && req.cookies[cookieName]) {
			console.log(req.cookies[cookieName]);
			return JSON.parse(req.cookies[cookieName]).access_token;
		}
		return null;
	}

	async validate(payload: any) {
		console.log(payload);
		return payload;
	}
}

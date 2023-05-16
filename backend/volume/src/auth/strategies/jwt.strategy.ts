import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UserInfo } from '../auth.service';
dotenv.config();

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
			const done = JSON.parse(req.cookies[cookieName]).access_token;
			console.log(process.env.JWT_SECRET);
			console.log(done);
			return done;
		}
		return null;
	}

	async validate(payload: any) {
		console.log('validated');
		return payload;
	}
}

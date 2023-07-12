import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtPartialStrategy extends PassportStrategy(Strategy, 'jwt-partial') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtPartialStrategy.extractJWT]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	private static extractJWT(request: any): string | null {
		if (request.cookies && request.cookies['session_cookie'])
			return JSON.parse(request.cookies['session_cookie']).access_token;
		return null;
	}

	async validate(payload: any) {
		return payload;
	}
}

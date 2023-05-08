import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
const axios = require('axios').default;

export interface IntraToken {
	accessToken: string;
	tokenType: string;
	expiresIn: number;
	refreshToken: string;
	scope: string;
	createdAt: number;
}

async function postTemporaryCode(intraCode: string): Promise<string> {
	try {
		const response: any = await axios.post(
			'https://api.intra.42.fr/oauth/token',
			{
				grant_type: 'authorization_code',
				client_id: process.env.CLIENT_UID,
				client_secret: process.env.CLIENT_SECRET,
				code: JSON.parse(intraCode).code,
				redirect_uri: 'http://localhost:4242/callback',
			},
		);
		return JSON.stringify(response.data);
	} catch (error) {
		return null;
	}
}

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}
	async exchangeCodeForToken(intraCode: string): Promise<IntraToken> {
		const response = await postTemporaryCode(intraCode);
		if (!response) return null;

		const responseJSON = JSON.parse(response) as IntraToken;
		return responseJSON;
	}

	async getJwtCookie(intraToken: IntraToken) {}
}

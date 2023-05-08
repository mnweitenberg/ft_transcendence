import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
const axios = require('axios').default;

export interface IntraToken {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	created_at: number;
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

	async linkTokenToUser(intraToken: IntraToken) {
		const axiosConfig = {
			headers: {
				Authorization:
					intraToken.token_type + ' ' + intraToken.access_token,
			},
		};
		const response = await axios.get(
			'https://api.intra.42.fr/v2/me',
			axiosConfig,
		);
		const intraId = response.data.id;

		return null;
	}

	async getJwtCookie(userInfo) {
		return null;
	}
}

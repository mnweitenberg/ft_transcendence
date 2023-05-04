import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { Login } from './login.model';
import * as dotenv from 'dotenv';
dotenv.config();
const axios = require('axios').default;

@Injectable()
export class LoginService {
	constructor(private readonly httpService: HttpService) {}
	login: Login = {
		client_uid: process.env.CLIENT_UID,
		client_secret: process.env.CLIENT_SECRET,
	};
	baseUrl: string = 'https://api.intra.42.fr/oauth/token';
	grantType: string = 'authorization_code';

	async getClientUid(): Promise<string> {
		return this.login.client_uid;
	}

	async isCookieValid(request: Request): Promise<boolean> {
		const reqCookie = request.cookies['session_cookie'];
		return reqCookie != undefined;
	}

	async getSessionToken(code: string) {
		var tmp: any;
		try {
			const response: any = await axios.post(this.baseUrl, {
				grant_type: this.grantType,
				client_id: this.login.client_uid,
				client_secret: this.login.client_secret,
				code: code,
				redirect_uri: 'http://localhost:5574/loading',
			});
			tmp = {
				code: 200,
				nestedJson: response.data,
			};
			console.log(response.data);
		} catch (error) {
			tmp = {
				code: 401,
				nestedJson: error,
			};
		}
		return JSON.stringify(tmp);
	}
}

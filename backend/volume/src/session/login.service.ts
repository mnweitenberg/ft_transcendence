import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Login } from './login.model';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LoginService {
	constructor(private readonly httpService: HttpService) {}
	login: Login = {
		client_uid: process.env.CLIENT_UID,
		client_secret: process.env.CLIENT_SECRET,
	};
	baseUrl: string = 'https://api.intra.42.fr/oauth/token';
	grantType: string = 'grant_type=authorization_code';

	async getClientUid() {
		return this.login.client_uid;
	}

	async sendCode(code: string) {
		var requestUrl: string =
			this.baseUrl +
			'?' +
			this.grantType +
			'&' +
			'client_id=' +
			this.login.client_uid +
			'&' +
			'client_secret=' +
			this.login.client_secret +
			'&' +
			'code=' +
			code +
			'&' +
			'redirect_uri=' +
			encodeURIComponent('http://localhost:5574/');
		console.log('requestUrl: ');
		console.log(requestUrl);
		return this.httpService.post(requestUrl).;
	}
}

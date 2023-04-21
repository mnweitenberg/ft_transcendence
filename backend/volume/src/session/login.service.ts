import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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

	async getClientUid() {
		return this.login.client_uid;
	}

	async sendCode(code: string) {
		axios
			.post(this.baseUrl, {
				grant_type: this.grantType,
				client_id: this.login.client_uid,
				client_secret: this.login.client_secret,
				code: code,
				redirect_uri: 'http://localhost:5574/loading',
			})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
				console.log('ERRORROROROROR');
			});
		return code;
	}
}

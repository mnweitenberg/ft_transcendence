import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { Login } from './login.model';
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

	async isCookieValid(request: Request): Promise<boolean> {
		const reqCookie = request.cookies['session_cookie'];
		return reqCookie != undefined;
	}
}

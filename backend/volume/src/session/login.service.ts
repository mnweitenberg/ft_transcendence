import { Injectable } from '@nestjs/common';
import { Login } from './login.model';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LoginService {
	login: Login = {
		client_uid: process.env.CLIENT_UID,
	};

	async getClientUid() {
		console.log(this.login.client_uid);
		return this.login.client_uid;
	}
}

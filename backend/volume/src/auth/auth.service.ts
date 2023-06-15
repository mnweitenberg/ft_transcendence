import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserAvatarService } from 'src/user/user-avatar.service';
import { UploadAvatarInput } from 'src/user/dto/upload-avatar.input';
const axios = require('axios').default;

export interface IntraToken {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	created_at: number;
}

export interface UserInfo {
	intraId: string;
	userUid: string;
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

async function downloadIntraAvatar(url: string, axiosConfig: any): Promise<UploadAvatarInput> {
	const file = await axios.get(url, {
			responseType: 'arraybuffer'
		})
		.then(response => Buffer.from(response.data, 'binary').toString('base64'));
	return { parentUserUid: "", file: file, filename: "intraPic" };
}

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly userAvatarService: UserAvatarService,
	) {}

	async exchangeCodeForToken(intraCode: string): Promise<IntraToken> {
		const response = await postTemporaryCode(intraCode);
		if (!response) return null;

		const responseJSON = JSON.parse(response) as IntraToken;
		return responseJSON;
	}

	async linkTokenToUser(intraToken: IntraToken): Promise<UserInfo> {
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
		let user: User = await this.userService.getUserByIntraId(
			response.data.id,
		);
		if (!user) {
			const intraAvatar = await downloadIntraAvatar(response.data.image.versions.small, axiosConfig);
			console.log(response.data.image.versions.micro);
			user = await this.userService.create({
				intraId: response.data.id,
				username: response.data.login,
			});
			intraAvatar.parentUserUid = user.id;
			user.avatar = await this.userAvatarService.create(intraAvatar);
			await this.userService.save(user);
		}
		return { userUid: user.id, intraId: user.intraId };
	}

	async getJwtCookie(userInfo: UserInfo): Promise<string> {
		const token = await this.jwtService.signAsync(userInfo);
		return JSON.stringify({ access_token: token });
	}
}

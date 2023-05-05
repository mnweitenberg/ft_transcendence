import { Injectable } from '@nestjs/common';

export interface IntraToken {}

@Injectable()
export class AuthService {
	getHello(): string {
		return 'Hello World!';
	}
	async exchangeCodeForToken(intraCode: string): Promise<IntraToken> {
		return null;
	}
}

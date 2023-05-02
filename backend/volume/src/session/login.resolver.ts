import {
	Args,
	Context,
	GraphQLExecutionContext,
	Mutation,
	Query,
	Resolver,
} from '@nestjs/graphql';
import { Response } from '@nestjs/common';
import { LoginService } from './login.service';
import { Login } from './login.model';

@Resolver((of) => Login)
export class LoginResolver {
	constructor(private loginService: LoginService) {}

	@Query((returns) => String)
	async clientUidQuery() {
		return this.loginService.getClientUid();
	}

	@Mutation((returns) => String)
	async sessionTokenMutation(
		@Context() context: GraphQLExecutionContext,
		@Args('code') code: string,
	) {
		const ctx = context as any;
		const sessionToken = JSON.parse(
			await this.loginService.getSessionToken(code),
		);
		if (sessionToken.code == 401) return sessionToken.code;
		ctx.res.cookie('session_cookie', sessionToken.nestedJson.access_token, {
			httpOnly: true,
			expires: new Date(Date.now() + 7199 * 1000),
			secure: true,
			sameSite: 'lax',
		});
		return code;
	}
}

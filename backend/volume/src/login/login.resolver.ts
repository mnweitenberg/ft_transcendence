import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { Login } from './login.model';
import { GraphQLContext } from 'src/utils/graphql-context';

@Resolver((of) => Login)
export class LoginResolver {
	constructor(private loginService: LoginService) {}

	@Query((returns) => String)
	async clientUidQuery() {
		return this.loginService.getClientUid();
	}

	@Query((returns) => Boolean)
	async validateCookieQuery(@Context() context: GraphQLContext) {
		return this.loginService.isCookieValid(context.req);
	}

	@Mutation((returns) => String)
	async sessionTokenMutation(
		// @Res() response: Response,
		@Context() context: GraphQLContext,
		@Args('code') code: string,
	) {
		const sessionToken = JSON.parse(
			await this.loginService.getSessionToken(code),
		);
		if (sessionToken.code == 401) return sessionToken.code;
		context.res.cookie(
			'session_cookie',
			sessionToken.nestedJson.access_token,
			{
				httpOnly: true,
				expires: new Date(Date.now() + 7199 * 1000),
				secure: true,
				sameSite: 'lax',
			},
		);
		console.log(context.switchToHttp().getRequest);
		return code;
	}
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
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
	async sendCodeMutation(@Args('code') code: string) {
		try {
			var result = this.loginService.sendCode(code);
		} catch (e) {
			throw new GraphQLError('Failed API request', {
				extensions: {
					code: 'INTERNAL_SERVER_ERROR',
				},
			});
		}
		return result;
	}
}

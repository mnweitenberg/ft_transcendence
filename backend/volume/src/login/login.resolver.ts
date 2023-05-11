import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { Login } from './login.model';
import { GraphQLContext } from 'src/utils/graphql-context';
import { ExecutionContext } from '@nestjs/common';

@Resolver((of) => Login)
export class LoginResolver {
	constructor(private loginService: LoginService) {}

	@Query((returns) => Boolean)
	async loginQuery(@Context() context: GraphQLContext) {
		return this.loginService.isCookieValid(context.req);
	}

	@Mutation((returns) => Boolean)
	async logoutMutation(@Context() context: GraphQLContext) {
		context.res.setHeader('Clear-Site-Data', '"cookies", "storage"');
		return true;
	}
}

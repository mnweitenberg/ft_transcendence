import { Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { Login } from './login.model';
import { GraphQLContext } from 'src/utils/graphql-context';

@Resolver(() => Login)
export class LoginResolver {
	constructor(private loginService: LoginService) {}

	@Query(() => Boolean)
	async loginQuery(@Context() context: GraphQLContext) {
		return this.loginService.isCookieValid(context.req);
	}

	@Mutation(() => Boolean)
	async logoutMutation(@Context() context: GraphQLContext) {
		context.res.setHeader('Clear-Site-Data', '"cookies", "storage"');
		return true;
	}
}

import { ExecutionContext } from '@nestjs/common';
import { Resolver, Query, Mutation, GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
	constructor(
		private authService: AuthService,
		private readonly userService: UserService,
	) {}

	// @
	@Query()
	async QRCodeQuery() {

	}

	@Mutation()
	async enableTwoFactorMutation() {

	}

	// @Query(() => Boolean)
	// async loginQuery(@Context() context: GraphQLContext) {
	// 	return this.authService.isCookieValid(context.req);
	// }

	// @Query(() => Boolean)
	// async loginQuery(context: ExecutionContext) {
	// 	const req =  GqlExecutionContext.create(context).getContext().req;
	// 	return this.authService.isCookieValid(req);
	// }
	//
	// // async logoutMutation(@Context() context: GraphQLContext) {
	// @Mutation(() => Boolean)
	// async logoutMutation(context: ExecutionContext) {
	// 	const gqlContext = GqlExecutionContext.create(context);
	//
	// 	gqlContext.getContext().res.setHeader('Clear-Site-Data', '"cookies", "storage"');
	// 	return true;
	// }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		console.log('AuthUser');
		const gqlContext = GqlExecutionContext.create(context);
		const req = gqlContext.getContext().req;
		if (req && req.user) return req.user;
		return null;
	},
);


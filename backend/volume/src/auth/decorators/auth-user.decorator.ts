import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		return GqlExecutionContext.create(ctx).getContext().req.user;
	},
);

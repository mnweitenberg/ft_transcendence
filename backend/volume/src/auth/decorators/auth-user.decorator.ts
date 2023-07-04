import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		if (context.getType() === 'ws') {
			const client = context.switchToWs().getClient();
			const user = client.user;
			if (user) return user;
		} else if (context.getType() as string === 'graphql') {
			const gqlContext = GqlExecutionContext.create(context);
			const req = gqlContext.getContext().req;
			if (req?.user) return req.user;
			if (req?.extra?.request?.user) return req.extra.request.user;
		}
		return null;
	},
);

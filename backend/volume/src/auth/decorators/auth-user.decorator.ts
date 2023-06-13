import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		if (context.getType() === 'ws') {
			const client = context.switchToWs().getClient();
			const user = client.user;
			if (user) return user;
		} else {
			const gqlContext = GqlExecutionContext.create(context);
			const req = gqlContext.getContext().req;
			if (req && req.user) return req.user;
		}
		return null;
	},
);

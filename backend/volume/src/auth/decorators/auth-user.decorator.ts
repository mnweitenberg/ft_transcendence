import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		// console.log('AuthUser');

		if(context.getType() === 'http') {
			// console.log('http');
			const gqlContext = GqlExecutionContext.create(context);
			const req = gqlContext.getContext().req;
			if (req && req.user) return req.user;
		} else if (context.getType() === 'ws') {
			// console.log('ws');
			const client = context.switchToWs().getClient();
			// console.log(client.user);
			const user = client.user;
			// console.log(user);
			if (user) return user;
		}

		return null;
	},
);


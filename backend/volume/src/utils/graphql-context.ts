import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

export type GraphQLContext = GraphQLExecutionContext & {
	req: Request & { extra?: any };
	res: Response;
};

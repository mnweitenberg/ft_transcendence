import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MatchBackendTemp {
	@Field()
	matched: boolean;

	@Field()
	playerOneId: string;

	@Field()
	playerTwoId: string;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Match {
	@Field()
	matched: boolean;

	@Field()
	playerOneId: string;

	@Field()
	playerTwoId: string;
}

import { Field, ObjectType } from '@nestjs/graphql'
import { isNullableType } from 'graphql';

@ObjectType()
export class Match {
	@Field()
	foundMatch: boolean;

	@Field( { nullable: true })
	playerOneName: String;

	@Field( { nullable: true })
	playerTwoName: String;
}
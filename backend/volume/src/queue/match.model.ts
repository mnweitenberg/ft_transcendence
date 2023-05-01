import { Field, ObjectType } from '@nestjs/graphql'
import { isNullableType } from 'graphql';

@ObjectType()
export class Match {
	@Field()
	foundMatch: boolean;

	// @Field(  )
	// id: number;
	// @Field( { nullable: true } )
	// id: number;

	// @Field()
	// playerOne: String;

	// @Field()
	// playerTwo: String;

	@Field( )
	playerOneName: String;

	@Field( )
	playerTwoName: String;
	// @Field( { nullable: true })
	// playerOneName: String;

	// @Field( { nullable: true })
	// playerTwoName: String;
}

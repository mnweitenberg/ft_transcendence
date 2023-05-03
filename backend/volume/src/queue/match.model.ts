import { Field, ObjectType } from '@nestjs/graphql';
import { isNullableType } from 'graphql';

/* 
	idle = can invite ppl, can accept invite, can join queue
	in_queue = can't do anything
	in_game = can only quit game
*/
enum player_status {
	idle,
	in_queue,
	in_game,
}

@ObjectType()
export class Match {
	@Field()
	matched: boolean;

	@Field()
	playerOneId: string;

	@Field()
	playerTwoId: string;

	// @Field()
	// playerStatus: player_status;

	// @Field(  )
	// id: number;
	// @Field( { nullable: true } )
	// id: number;

	// @Field()
	// playerOne: String;

	// @Field()
	// playerTwo: String;

	// @Field( )
	// playerOneName: String;

	// @Field( )
	// playerTwoName: String;
	// @Field( { nullable: true })
	// playerOneName: String;

	// @Field( { nullable: true })
	// playerTwoName: String;
}

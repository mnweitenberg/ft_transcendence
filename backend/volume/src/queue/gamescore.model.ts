import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GamerScore {
	@Field()
	id: number;

	@Field()
	playerOne: UserGame;

	@Field()
	playerTwo: UserGame;

	@Field()
	score: Score;
}

@ObjectType()
class Score {
	playerOne: number;
	playerTwo: number;
}

@ObjectType()
class Stats {
	ranking: number;
	wins: number;
	losses: number;
	score: number;
}

@ObjectType()
class UserGame {
	@Field()
	name: String;

	@Field()
	avatar: String;

	@Field()
	stats: Stats;

	@Field()
	status: String;

	@Field ( { nullable: true } )
	friends: UserGame[]
}
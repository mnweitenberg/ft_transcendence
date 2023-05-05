import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
class Stats {
	@Column()
	@Field()
	ranking: number;

	@Column()
	@Field()
	wins: number;

	@Column()
	@Field()
	losses: number;

	@Column()
	@Field()
	score: number;
}

@Entity()
@ObjectType()
class UserGame {
	@Column()
	@Field()
	name: string;

	@Column()
	@Field()
	avatar: string;

	@Column()
	@Field()
	stats: Stats;

	@Column()
	@Field()
	status: string;

	@Column()
	@Field({ nullable: true })
	friends: UserGame[];
}

@Entity()
@ObjectType()
class Score {
	@Column()
	@Field()
	playerOne: number;

	@Column()
	@Field()
	playerTwo: number;
}

@Entity()
@ObjectType()
export class GamerScore {
	@PrimaryGeneratedColumn()
	@Field()
	queue_id: string;

	@Column()
	@Field()
	id: number;

	@Column()
	@Field()
	playerOne: UserGame;

	@Column()
	@Field()
	playerTwo: UserGame;

	@Column()
	@Field()
	score: Score;
}

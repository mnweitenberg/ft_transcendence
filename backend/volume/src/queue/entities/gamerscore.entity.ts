import { Field, ObjectType } from '@nestjs/graphql';
import { Generated, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
@ObjectType()
export class Stats {
	@PrimaryGeneratedColumn()
	id: number;

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
export class UserGame {
	@PrimaryColumn()
	@Field()
	user_id: string;


	@Column()
	@Field()
	name: string;

	@Column()
	@Field()
	avatar: string = "";

	@OneToOne(Type => Stats)
	@Field({ nullable: true })
	stats: Stats;

	@Column()
	@Field()
	status: string;

	// @ManyToMany(type => UserGame) @JoinTable()
	// @Field({ nullable: true })
	// friends: UserGame[];
}

@Entity()
@ObjectType()
export class Score {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Field()
	playerOne: number = 0;

	@Column()
	@Field()
	playerTwo: number = 0;
}

@Entity()
@ObjectType()
export class GamerScore {
	@PrimaryGeneratedColumn()
	@Field()
	match_id: string;

	@Column()
	@Generated("uuid")
	uuid: string;

	// @Column()
	// @Field()
	// id: number;

	@OneToOne(type => UserGame)
	@Field()
	playerOne: UserGame;

	@OneToOne(type => UserGame)
	@Field()
	playerTwo: UserGame;

	@OneToOne(type => Score)
	@Field()
	score: Score;
}

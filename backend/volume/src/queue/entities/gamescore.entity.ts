import { Field, ObjectType } from '@nestjs/graphql';
import { Generated, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
@ObjectType()
export class Stats {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Field()
	ranking: number = 999;

	@Column()
	@Field()
	wins: number = 0;

	@Column()
	@Field()
	losses: number = 0;

	@Column()
	@Field()
	score: number = 0;
}

@Entity()
@ObjectType()
export class UserGame {
	@PrimaryColumn()
	@Field()
	userId: string;

	@Column()
	@Field()
	name: string;

	@Column()
	@Field()
	avatar: string = "";

	@OneToOne(Type => Stats)
	@JoinColumn()
	@Field()
	stats: Stats;

	@Column()
	@Field()
	status: string;

	// FIXME: is nodig voor gameScore
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

// FIXME: waarschijnlijk is dit geen entity (hoeft niet in de database)
@Entity()
@ObjectType()
export class GameScore {
	@Column()
	@PrimaryGeneratedColumn("uuid")
	uuid: string;

	@Field()
	matchId: number;


	// @Column()
	// @Field()
	// id: number;

	@OneToOne(type => UserGame)
	@JoinColumn()
	@Field()
	playerOne: UserGame;

	@OneToOne(type => UserGame)
	@JoinColumn()
	@Field()
	playerTwo: UserGame;

	@OneToOne(type => Score)
	@Field()
	score: Score;
}

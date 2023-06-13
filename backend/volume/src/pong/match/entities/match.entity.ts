import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@Entity()
@ObjectType()
export class Match {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	gameId: string;

	@ManyToMany(() => User, (user) => user.match_history)
	@JoinTable()
	@Field(() => [User])
	players: User[];

	@Column()
	@Field(() => Int)
	p1Score: number;

	@Column()
	@Field(() => Int)
	p2Score: number;

	@Column()
	@Field(() => Boolean)
	isFinished: boolean;
}

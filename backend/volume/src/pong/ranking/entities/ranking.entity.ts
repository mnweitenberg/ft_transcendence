import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Ranking {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@OneToOne(() => User, (user) => user.ranking)
	@Field()
	user: User;

	@Column()
	@Field()
	rank: number;

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

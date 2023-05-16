import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@Entity()
@ObjectType()
export class Match {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	gameId: string;

	@ManyToOne(() => User)
	@Field((type) => User)
	playerOne: User;
	// @Column()
	// @Field()
	// playerOneID: string;

	@Column()
	@Field((type) => Int)
	playerOneScore: number;

	@ManyToOne(() => User)
	@Field((type) => User)
	playerTwo: User;
	// @Column()
	// @Field()
	// playerTwoID: string;

	@Column()
	@Field((type) => Int)
	playerTwoScore: number;
}

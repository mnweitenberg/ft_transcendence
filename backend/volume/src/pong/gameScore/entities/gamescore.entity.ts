import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
// import { User } from 'src/user/entities/user.entity';

@Entity()
@ObjectType()
export class Score {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	gameId: string;

	// @OneToOne(() => User)
	// @Field((type) => User)
	// playerOne: User;
	@Column()
	@Field()
	playerOneID: string;

	@Column()
	@Field((type) => Int)
	playerOneScore: number;

	// @OneToOne(() => User)
	// @Field((type) => User)
	// playerTwo: User;
	@Column()
	@Field()
	playerTwoID: string;

	@Column()
	@Field((type) => Int)
	playerTwoScore: number;
}

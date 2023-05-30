import {
	Column,
	Entity,
	ManyToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channel/entities/channel.entity';
import { Ranking } from 'src/pong/ranking/entities/ranking.entity';
import { Match } from 'src/pong/match/entities/match.entity';

@Entity()
@ObjectType()
export class User {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@Column({
		unique: true,
	})
	@Field()
	intraId: string;

	@Column({
		unique: true,
	})
	@Field()
	username: string;

	@Column({
		nullable: true,
	})
	@Field()
	avatar: string = ""; // FIXME: temp fix

	@ManyToMany(() => Channel, (channel) => channel.members)
	@Field(() => [Channel], { nullable: true })
	channels: Channel[];

	@OneToOne(() => Ranking, (ranking) => ranking.user)
	@Field(() => Ranking)
	ranking: Ranking;

	@ManyToMany(() => Match, (match) => match.players)
	@Field(() => [Match])
	match_history: Match[];
}

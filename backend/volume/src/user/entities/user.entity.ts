import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Buffer } from 'node:buffer';
import { Field, ObjectType } from '@nestjs/graphql';
import { GroupChat } from 'src/chat/group/chat/entities/group_chat.entity';
import { Ranking } from 'src/pong/ranking/entities/ranking.entity';
import { Match } from 'src/pong/match/entities/match.entity';
import { Avatar } from 'src/user/entities/avatar.entity';
import { PersonalChat } from 'src/chat/personal/chat/entities/personal_chat.entity';

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

	@OneToOne(() => Avatar)
	@JoinColumn()
	@Field()
	avatar: Avatar;

	@ManyToMany(() => GroupChat, (channel) => channel.members)
	@Field(() => [GroupChat])
	group_chats: GroupChat[];

	@ManyToMany(() => PersonalChat, (channel) => channel.members)
	@Field(() => [PersonalChat])
	personal_chats: PersonalChat[];

	@OneToOne(() => Ranking, (ranking) => ranking.user)
	@Field(() => Ranking)
	ranking: Ranking;

	@ManyToMany(() => Match, (match) => match.players)
	@Field(() => [Match])
	match_history: Match[];
}

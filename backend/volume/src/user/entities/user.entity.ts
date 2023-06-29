import {
	Column,
	Entity,
	ManyToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	JoinColumn,
	JoinTable,
} from 'typeorm';
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

	@Column({ nullable: true })
	twoFASecret: string;

	@Column('boolean', { default: false })
	twoFAEnabled: boolean = false;

	@OneToOne(
		() => Avatar, {onDelete: "SET NULL", orphanedRowAction: "delete"}
	)
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
	@JoinColumn()
	@Field(() => Ranking)
	ranking: Ranking;

	@ManyToMany(() => Match, (match) => match.players)
	@JoinTable()
	@Field(() => [Match])
	match_history: Match[];

	@ManyToMany(type => User, user => user.friends)
	@JoinTable()
	friends: User[];
}

import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { GroupChat } from '../../chat/entities/group_chat.entity';

@Entity()
@ObjectType()
export class GroupMessage {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@Column()
	@Field()
	content: string;

	@CreateDateColumn()
	@Field()
	dateSent: Date;

	@ManyToOne(() => GroupChat, (channel) => channel.messages)
	@Field(() => GroupChat)
	channel: GroupChat;

	@ManyToOne(() => User)
	@Field(() => User)
	author: User;
}

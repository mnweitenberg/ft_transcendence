import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { PersonalChat } from '../../chat/entities/personal_chat.entity';

@Entity()
@ObjectType()
export class PersonalMessage {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@Column()
	@Field()
	content: string;

	@CreateDateColumn()
	@Field()
	dateSent: Date;

	@ManyToOne(() => PersonalChat, (channel) => channel.messages)
	@Field(() => PersonalChat)
	channel: PersonalChat;

	@ManyToOne(() => User)
	@Field(() => User)
	author: User;
}

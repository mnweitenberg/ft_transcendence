import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Entity()
@ObjectType()
export class Message {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@Column()
	@Field()
	content: string;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	@Field(() => Channel)
	channel: Channel;

	@ManyToOne(() => User)
	@Field(() => User)
	author: User;
}
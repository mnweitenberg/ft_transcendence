import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channel/entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';

@Entity()
@ObjectType()
export class User {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@Column()
	@Field()
	username: string;

	@Column()
	@Field()
	email: string;

	@Column()
	@Field()
	password: string;

	@Column()
	@Field((type) => Int)
	wins: number = 0;

	@Column()
	@Field((type) => Int)
	losses: number = 0;

	@ManyToMany((type) => Channel, (channel) => channel.members)
	@Field((type) => [Channel], { nullable: true })
	channels: Channel[];

	@OneToMany(() => Message, (message) => message.author)
	@Field((type) => [Message], { nullable: true })
	messages: Message[];
}

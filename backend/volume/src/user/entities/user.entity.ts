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

	@Column()
	@Field()
	avatar: string;

	@ManyToMany((type) => Channel, (channel) => channel.members)
	@Field((type) => [Channel], { nullable: true })
	channels: Channel[];

	@OneToMany(() => Message, (message) => message.author)
	@Field((type) => [Message], { nullable: true })
	messages: Message[];
}

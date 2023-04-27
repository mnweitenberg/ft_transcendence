import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';

@Entity()
@ObjectType()
export class Channel {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@ManyToMany((type) => User, (user) => user.channels)
	@JoinTable()
	@Field((type) => [User], { nullable: true })
	members: User[];

	@OneToMany(() => Message, (message) => message.channel)
	@Field((type) => [Message], { nullable: true })
	messages: Message[];

	@Column()
	@Field(() => String, {
		description: 'name of the channel',
	})
	name: string;

	@Column()
	@Field(() => String, {
		description: 'logo of the channel',
	})
	logo: string;
}

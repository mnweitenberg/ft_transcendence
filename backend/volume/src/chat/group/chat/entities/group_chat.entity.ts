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
import { GroupMessage } from '../../message/entities/group_message.entity';

@Entity()
@ObjectType()
export class GroupChat {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@ManyToMany(() => User, (user) => user.group_chats)
	@JoinTable()
	@Field(() => [User], { nullable: true })
	members: User[];

	@OneToMany(() => GroupMessage, (message) => message.channel)
	@Field(() => [GroupMessage], { nullable: true })
	messages: GroupMessage[];

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

	@Field(() => GroupMessage, { nullable: true })
	lastMessage: GroupMessage;
}

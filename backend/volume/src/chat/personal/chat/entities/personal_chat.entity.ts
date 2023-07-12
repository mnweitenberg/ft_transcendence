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
import { PersonalMessage } from '../../message/entities/personal_message.entity';

@Entity()
@ObjectType()
export class PersonalChat {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@ManyToMany(() => User, (user) => user.personal_chats)
	@JoinTable()
	@Field(() => [User], { nullable: true })
	members: User[];

	@OneToMany(() => PersonalMessage, (message) => message.channel)
	@Field(() => [PersonalMessage])
	messages: PersonalMessage[];

	@Field(() => String, {
		description: 'name of the channel',
	})
	name: string = '';

	@Column()
	@Field(() => String, {
		description: 'logo of the channel',
	})
	logo: string = '';

	@Field(() => PersonalMessage, { nullable: true })
	lastMessage: PersonalMessage;
}

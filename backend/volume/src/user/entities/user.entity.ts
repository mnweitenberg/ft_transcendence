import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Chat } from 'src/chat/entities/chat.entity';

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

	@ManyToMany((type) => Chat, (chat) => chat.members)
	@Field((type) => [Chat], { nullable: true })
	chats: Chat[];
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Queue } from 'src/queue/entities/queue.entity';
// import { Queue, QueueWaiting } from './../../queue/entities/queue.entity';

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
}

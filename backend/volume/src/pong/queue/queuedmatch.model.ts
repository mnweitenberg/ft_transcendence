import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class QueuedMatch {
	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: string;

	@Field()
	p1: User;

	@Field()
	p2: User;
}

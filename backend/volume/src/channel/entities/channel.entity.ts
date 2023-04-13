import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

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
}

import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Avatar {
	@PrimaryColumn()
	@Field()
	parentUserUid: string;

	@Column()
	@Field()
	file: string;

	@Column()
	@Field()
	filename: string;
}

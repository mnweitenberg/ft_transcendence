import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class QueuedMatch {
	@Field()
	p1: User;

	@Field()
	p2: User;
}

import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class QueuedMatch {
	@Field()
	playerOne: User;

	@Field()
	playerTwo: User;
}

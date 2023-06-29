import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Login {
	@Field(() => String)
	client_uid: string;

	client_secret: string;
}

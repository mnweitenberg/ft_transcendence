import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Login {
	@Field((type) => String)
	client_uid: string;

	client_secret: string;
}

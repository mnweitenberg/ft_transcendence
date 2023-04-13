import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
	@Field(() => String, { description: 'Username' })
	username: string;

	@Field(() => String, { description: "User's email" })
	email: string;

	@Field(() => String, { description: "User's password" })
	password: string;
}

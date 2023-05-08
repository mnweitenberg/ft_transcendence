import { InputType, Field } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';

// @InputType()
// export class CreateUserInput {
// 	@Field(() => String, { description: 'Username' })
// 	username: string;

// 	@Field(() => String, { description: "User's email" })
// 	email: string;

// 	@Field(() => String, { description: "User's password" })
// 	password: string;
// }

@InputType()
export class CreateUserInput {
	@Field()
	@IsNumberString()
	intraId: string;

	@Field()
	username: string;
}

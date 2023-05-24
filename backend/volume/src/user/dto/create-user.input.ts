import { Buffer } from 'node:buffer';
import { InputType, Field } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';

@InputType()
export class CreateUserInput {
	@Field()
	@IsNumberString()
	intraId: string;

	@Field()
	username: string;

	@Field()
	avatar: Buffer;
}

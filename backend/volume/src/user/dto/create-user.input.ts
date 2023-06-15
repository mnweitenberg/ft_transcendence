import { InputType, Field } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';
import { Avatar } from '../entities/avatar.entity';
import { UploadAvatarInput } from './upload-avatar.input';

@InputType()
export class CreateUserInput {
	@Field()
	@IsNumberString()
	intraId: string;

	@Field()
	username: string;
}

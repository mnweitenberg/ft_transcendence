import { InputType, Field } from '@nestjs/graphql';
import { UploadAvatarInput } from './upload-avatar.input';

@InputType()
export class ChangeUserDataInput {
	@Field({ nullable: true })
	username?: string;

	@Field({ nullable: true })
	avatar?: UploadAvatarInput;
}

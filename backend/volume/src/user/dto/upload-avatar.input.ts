import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UploadAvatarInput {

	parentUserUid: string;

	@Field()
	file: string;

	@Field()
	filename: string;
}

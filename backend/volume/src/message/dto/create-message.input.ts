import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateMessageInput {
	@Field(() => String, {
		description: 'id of the channel this message is sent to',
	})
	channel_id: string;

	@Field(() => String, {
		description: 'content of the message',
	})
	content: string;

	@Field(() => String, {
		description: 'id of the user who sent this message',
	})
	author_id: string;
}

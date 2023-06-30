import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreatePersonalMessageInput {
	@Field(() => String, {
		description: 'id of the channel this message is sent to',
	})
	channel_id: string;

	@Field(() => String, {
		description: 'content of the message',
	})
	content: string;
}

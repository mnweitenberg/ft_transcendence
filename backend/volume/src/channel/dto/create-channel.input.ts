import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateChannelInput {
	@Field(() => [String], {
		description: "id's of all the members in this channel",
	})
	member_ids: string[];
}

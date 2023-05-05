import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateChannelInput {
	@Field(() => String, {
		description: 'name of the channel',
	})
	name: string;

	@Field(() => String, {
		description: 'logo of the channel',
	})
	logo: string;

	@Field(() => [String], {
		description: "id's of all the members in this channel",
	})
	member_ids: string[];
}

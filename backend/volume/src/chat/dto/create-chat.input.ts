import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateChatInput {
	@Field(() => [String], {
		description: "id's of all the members in this chat",
	})
	member_ids: string[];
}

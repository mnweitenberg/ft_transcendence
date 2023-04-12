import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
	@Field(() => [String], { description: 'id\'s of all the members in this chat' })
	member_ids: string[];
}

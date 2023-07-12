import { ArgsType, Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MultiBlockStateChange {
	@Field()
	user_id: String;
	@Field()
	blocked: Boolean;
}

@ArgsType()
export class MultiBlockStateChangeInput {
	@Field(() => [String])
	user_ids: string[];
}

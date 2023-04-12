import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { ChatService } from './chat.service';
import { inspect } from 'util';

@Resolver((of) => Chat)
export class ChatResolver {
	constructor(
		private readonly chat_service: ChatService,
	) {}

	@Query((returns) => [Chat])
	async all_chats() {
		// console.log(inspect(info["fieldNodes"][0]["selectionSet"], { depth: 4, colors: true }));
		return this.chat_service.getAllChats();
	}

	@Mutation((returns) => Chat, { nullable: true })
	async create_chat(@Args('chat') chat: CreateChatInput) {
		return this.chat_service.create(chat);
	}

	@ResolveField()
	async members(@Parent() chat: Chat) {
		return this.chat_service.getMembers(chat);
	}
}

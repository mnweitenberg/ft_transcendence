import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { ChatService } from './chat.service';

@Resolver((of) => Chat)
export class ChatResolver {
	constructor(private readonly chat_service: ChatService) {}

	@Query((returns) => [Chat])
	async all_chats() {
		return this.chat_service.getAllChats();
	}

	@Mutation((returns) => Chat, { nullable: true })
	async createChat(@Args() chat: CreateChatInput) {
		return this.chat_service.create(chat);
	}

	@ResolveField()
	async members(@Parent() chat: Chat) {
		return this.chat_service.getMembers(chat);
	}
}

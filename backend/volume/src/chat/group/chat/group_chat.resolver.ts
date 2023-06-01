import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
	Subscription,
} from '@nestjs/graphql';
import { GroupChat } from './entities/group_chat.entity';
import { CreateGroupChannelInput } from './dto/create_group_chat.input';
import { GroupChatService } from './group_chat.service';
import { GroupMessage } from '../message/entities/group_message.entity';
import { pubSub } from 'src/app.module';

@Resolver((of) => GroupChat)
export class GroupChatResolver {
	constructor(private readonly group_chat_service: GroupChatService) {}

	@Query((returns) => [GroupChat])
	async all_group_chats() {
		return this.group_chat_service.getAllChannels();
	}

	@Query((returns) => GroupChat) // TODO: add guards, to check if the user is a member of the channel, else disallow (also do this in other places)
	async group_chat(@Args('id') id: string) {
		return this.group_chat_service.getChannelById(id);
	}

	@Mutation((returns) => GroupChat, { nullable: true })
	async createGroupChat(@Args() channel_input: CreateGroupChannelInput) {
		return this.group_chat_service.create(channel_input);
	}

	@ResolveField()
	async members(@Parent() channel: GroupChat) {
		return this.group_chat_service.getMembers(channel);
	}

	@ResolveField()
	async messages(@Parent() channel: GroupChat) {
		return this.group_chat_service.getMessages(channel);
	}

	@ResolveField()
	async lastMessage(@Parent() channel: GroupChat) { // NOTE: maybe there is a better way to do this
		const messages = channel.messages ?? await this.messages(channel);
		if (messages.length > 0)
			return messages[messages.length - 1];
		return null;
	}
}

import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { GroupChat } from './entities/group_chat.entity';
import { CreateGroupChannelInput } from './dto/create_group_chat.input';
import { GroupChatService } from './group_chat.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/user-info.interface';

@Resolver(() => GroupChat)
export class GroupChatResolver {
	constructor(private readonly group_chat_service: GroupChatService) {}

	@Query(() => [GroupChat])
	async all_group_chats() {
		return this.group_chat_service.getAllChannels();
	}

	@Query(() => [GroupChat])
	@UseGuards(JwtAuthGuard)
	async all_available_public_channels(@AuthUser() userInfo: UserInfo) {
		return this.group_chat_service.getAvailablePublicChannels(
			userInfo.userUid,
		);
	}

	@Query(() => GroupChat) // TODO: add guards, to check if the user is a member of the channel, else disallow (also do this in other places)
	async group_chat(@Args('id') id: string) {
		return this.group_chat_service.getChannelById(id);
	}

	@Mutation(() => GroupChat, { nullable: true })
	async createGroupChat(@Args() channel_input: CreateGroupChannelInput) {
		return this.group_chat_service.create(channel_input);
	}

	@Mutation(() => GroupChat, { nullable: true })
	@UseGuards(JwtAuthGuard)
	async joinGroupChat(
		@AuthUser() userInfo: UserInfo,
		@Args('channelId') channelId: string,
	) {
		return this.group_chat_service.join(userInfo.userUid, channelId);
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
	async lastMessage(@Parent() channel: GroupChat) {
		// NOTE: maybe there is a better way to do this
		const messages = channel.messages ?? (await this.messages(channel));
		if (messages.length > 0) return messages[messages.length - 1];
		return null;
	}
}

import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { PersonalChat } from './entities/personal_chat.entity';
import { PersonalChatService } from './personal_chat.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/user-info.interface';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAvatarService } from 'src/user/user-avatar.service';

@Resolver(() => PersonalChat)
export class PersonalChatResolver {
	constructor(private readonly personal_chat_service: PersonalChatService, private readonly user_avatar_service: UserAvatarService) {}

	@Query(() => [PersonalChat])
	async all_personal_chats() {
		return this.personal_chat_service.getAllChannels();
	}

	@Query(() => PersonalChat) // TODO: add guards, to check if the user is a member of the channel, else disallow (also do this in other places)
	async personal_chat(@Args('id') id: string) {
		return this.personal_chat_service.getChannelById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => PersonalChat, { nullable: true })
	async createPersonalChat(
		@AuthUser() user_info: UserInfo,
		@Args('userId') userId: string,
	) {
		return this.personal_chat_service.create(user_info.userUid, userId);
	}

	@ResolveField()
	async members(@Parent() channel: PersonalChat) {
		return this.personal_chat_service.getMembers(channel);
	}

	@ResolveField()
	async messages(@Parent() channel: PersonalChat) {
		return this.personal_chat_service.getMessages(channel);
	}


	@ResolveField()
	async name(@Parent() channel: PersonalChat, @AuthUser() user_info: UserInfo) {
		const members = await this.personal_chat_service.getMembers(channel);
		if (members[0].id === user_info.userUid) return members[1].username;
		return members[0].username;
	}

	@ResolveField()
	async lastMessage(@Parent() channel: PersonalChat) {
		// NOTE: maybe there is a better way to do this
		const messages = channel.messages ?? (await this.messages(channel));
		if (messages.length > 0) return messages[messages.length - 1];
		return null;
	}

	@ResolveField()
	async logo(
		@Parent() channel: PersonalChat,
		@AuthUser() user_info: UserInfo,
	) {
		const members = channel.members ?? (await this.members(channel));
		if (members[0].id === user_info.userUid) return this.user_avatar_service.getAvatar(members[1].id).then((avatar) => avatar.file);
		return this.user_avatar_service.getAvatar(members[0].id).then((avatar) => avatar.file);
	}
}

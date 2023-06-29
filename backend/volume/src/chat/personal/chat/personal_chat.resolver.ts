import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
	Subscription,
} from '@nestjs/graphql';
import { PersonalChat } from './entities/personal_chat.entity';
import { CreatePersonalChatInput } from './dto/create_personal_chat.input';
import { PersonalChatService } from './personal_chat.service';
import { PersonalMessage } from '../message/entities/personal_message.entity';
import { pubSub } from 'src/app.module';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';

@Resolver((of) => PersonalChat)
export class PersonalChatResolver {
	constructor(private readonly personal_chat_service: PersonalChatService) {}

	@Query((returns) => [PersonalChat])
	async all_personal_chats() {
		return this.personal_chat_service.getAllChannels();
	}

	@Query((returns) => PersonalChat) // TODO: add guards, to check if the user is a member of the channel, else disallow (also do this in other places)
	async personal_chat(@Args('id') id: string) {
		return this.personal_chat_service.getChannelById(id);
	}

	@Mutation((returns) => PersonalChat, { nullable: true })
	async createPersonalChat(@Args() channel_input: CreatePersonalChatInput) {
		return this.personal_chat_service.create(channel_input);
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
	async lastMessage(@Parent() channel: PersonalChat) { // NOTE: maybe there is a better way to do this
		const messages = channel.messages ?? await this.messages(channel);
		if (messages.length > 0)
			return messages[messages.length - 1];
		return null;
	}

	@ResolveField()
	async logo(@Parent() channel: PersonalChat, @AuthUser() user_info: UserInfo) {
		const members = channel.members ?? await this.members(channel);
		if (members[0].id === user_info.userUid)
			return members[1].avatar;
		return members[0].avatar;
	}
}

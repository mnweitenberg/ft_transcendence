import {
	Args,
	Mutation,
	Parent,
	ResolveField,
	Resolver,
	Subscription,
} from '@nestjs/graphql';
import { GroupMessage } from './entities/group_message.entity';
import { CreateGroupMessageInput } from './dto/create_group_message.input';
import { GroupMessageService } from './group_message.service';
import { pubSub } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/user-info.interface';

@Resolver(() => GroupMessage)
export class GroupMessageResolver {
	constructor(private readonly group_message_service: GroupMessageService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => GroupMessage, { nullable: true })
	async createGroupMessage(
		@Args() message_input: CreateGroupMessageInput,
		@AuthUser() user_info: UserInfo,
	) {
		const message = this.group_message_service.create(
			message_input,
			user_info.userUid,
		);
		pubSub.publish('group_message_sent', { group_message_sent: message });
		return message;
	}

	@Subscription(() => GroupMessage, {
		filter: async (payload, variables) => {
			console.log({
				payload: {
					group_message_sent: await payload.group_message_sent,
				},
				variables,
			});
			if (variables.channel_id === null) return true;
			return (
				(await payload.group_message_sent).channel.id ===
				variables.channel_id
			);
		},
	})
	async group_message_sent(
		@Args('channel_id', { nullable: true }) channel_id: string,
	) {
		return pubSub.asyncIterator('group_message_sent');
	}

	@ResolveField()
	async channel(@Parent() message: GroupMessage) {
		return this.group_message_service.getChannel(message);
	}

	@ResolveField()
	async author(@Parent() message: GroupMessage) {
		return this.group_message_service.getAuthor(message);
	}
}

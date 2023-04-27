import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
	Subscription,
} from '@nestjs/graphql';
import { Channel } from './entities/channel.entity';
import { CreateChannelInput } from './dto/create-channel.input';
import { ChannelService } from './channel.service';
import { Message } from 'src/message/entities/message.entity';
import { pubSub } from 'src/app.module';

@Resolver((of) => Channel)
export class ChannelResolver {
	constructor(private readonly channel_service: ChannelService) {}

	@Query((returns) => [Channel])
	async allChannels() {
		return this.channel_service.getAllChannels();
	}

	@Query((returns) => Channel) // TODO: add guards, to check if the user is a member of the channel, else disallow (also do this in other places)
	async getChannel(@Args('id') id: string) {
		return this.channel_service.getChannelById(id);
	}

	@Mutation((returns) => Channel, { nullable: true })
	async createChannel(@Args() channel_input: CreateChannelInput) {
		return this.channel_service.create(channel_input);
	}

	@Subscription((returns) => Message, {
		filter: async (payload, variables) => {
			console.log({payload: {messageSent: await payload.messageSent}, variables})
			return (await payload.messageSent).channel.id === variables.channel_id;
		}
	})
	async messageSent(@Args('channel_id') channel_id: string) {
		return pubSub.asyncIterator('messageSent');
	}

	@ResolveField()
	async members(@Parent() channel: Channel) {
		return this.channel_service.getMembers(channel);
	}

	@ResolveField()
	async messages(@Parent() channel: Channel) {
		return this.channel_service.getMessages(channel);
	}

	@ResolveField()
	async lastMessage(@Parent() channel: Channel) { // NOTE: maybe there is a better way to do this
		const messages = channel.messages ?? await this.messages(channel);
		if (messages.length > 0)
			return messages[messages.length - 1];
		return null;
	}
}

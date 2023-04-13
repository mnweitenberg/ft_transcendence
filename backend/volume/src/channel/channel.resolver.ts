import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Channel } from './entities/channel.entity';
import { CreateChannelInput } from './dto/create-channel.input';
import { ChannelService } from './channel.service';

@Resolver((of) => Channel)
export class ChannelResolver {
	constructor(private readonly channel_service: ChannelService) {}

	@Query((returns) => [Channel])
	async allChannels() {
		return this.channel_service.getAllChannels();
	}

	@Mutation((returns) => Channel, { nullable: true })
	async createChannel(@Args() channel_input: CreateChannelInput) {
		return this.channel_service.create(channel_input);
	}

	@ResolveField()
	async members(@Parent() channel: Channel) {
		return this.channel_service.getMembers(channel);
	}
}

import {
	Args,
	Mutation,
	Parent,
	ResolveField,
	Resolver,
	Subscription,
} from '@nestjs/graphql';
import { PersonalMessage } from './entities/personal_message.entity';
import { CreatePersonalMessageInput } from './dto/create_personal_message.input';
import { PersonalMessageService } from './personal_message.service';
import { pubSub } from 'src/app.module';

@Resolver((of) => PersonalMessage)
export class PersonalMessageResolver {
	constructor(private readonly message_service: PersonalMessageService) {}

	@Mutation((returns) => PersonalMessage, { nullable: true })
	async createMessage(@Args() message_input: CreatePersonalMessageInput) {
		const message = this.message_service.create(message_input);
		pubSub.publish('personal_message_sent', { personal_message_sent: message });
		return message;
	}

	@Subscription((returns) => PersonalMessage, {
		filter: async (payload, variables) => {
			console.log({payload: {personal_message_sent: await payload.personal_message_sent}, variables})
			if (variables.channel_id === null) return true;
			return (await payload.personal_message_sent).channel.id === variables.channel_id;
		}
	})
	async personal_message_sent(@Args('channel_id', {nullable: true}) channel_id: string) {
		return pubSub.asyncIterator('personal_message_sent');
	}

	@ResolveField()
	async channel(@Parent() message: PersonalMessage) {
		return this.message_service.getChannel(message);
	}

	@ResolveField()
	async author(@Parent() message: PersonalMessage) {
		return this.message_service.getAuthor(message);
	}
}

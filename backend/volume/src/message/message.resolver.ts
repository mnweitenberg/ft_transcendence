import {
	Args,
	Mutation,
	Parent,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageService } from './message.service';
import { pubSub } from 'src/app.module';

@Resolver((of) => Message)
export class MessageResolver {
	constructor(private readonly message_service: MessageService) {}

	@Mutation((returns) => Message, { nullable: true })
	async createMessage(@Args() message_input: CreateMessageInput) {
		const message = this.message_service.create(message_input);
		pubSub.publish('messageSent', { messageSent: message });
		return message;
	}

	@ResolveField()
	async channel(@Parent() message: Message) {
		return this.message_service.getChannel(message);
	}

	@ResolveField()
	async author(@Parent() message: Message) {
		return this.message_service.getAuthor(message);
	}
}

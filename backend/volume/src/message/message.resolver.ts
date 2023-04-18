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

@Resolver((of) => Message)
export class MessageResolver {
	constructor(private readonly message_service: MessageService) {}

	@Mutation((returns) => Message, { nullable: true })
	async createMessage(@Args() message_input: CreateMessageInput) {
		return this.message_service.create(message_input);
	}

	@ResolveField()
	async channel(@Parent() message: Message) {
		return this.message_service.getChannel(message);
	}

	@ResolveField()
	async sender(@Parent() message: Message) {
		return this.message_service.getSender(message);
	}
}

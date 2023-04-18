import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { rij, Queue } from './queue.model'
// import { Queue, rij } from './entities/queue.entity';
import { User } from '../user/entities/user.entity'


@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@Mutation((returns) => Queue)
	async joinGlobalQueue(
		@Args('username', { type: () => String }) usernameParameter: string,
	) {
		return this.queueService.join(usernameParameter);
	}

}

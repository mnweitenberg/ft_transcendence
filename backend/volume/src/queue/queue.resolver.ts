import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { QueueService } from './queue.service';
import { Queue } from './queue.model'
import { Match } from './match.model'

// 'npm install graphql-subscriptions graphql' to install package voor pubsub
const pubSub = new PubSub();


@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@Query((returns) => [Queue])
	printQueue()
	{
		return this.queueService.printQ();
	}

	@Mutation((returns) => Match)
	async joinGlobalQueue(
		@Args('username', { type: () => String }) usernameParameter: string,
	) {
		const match = this.queueService.join(usernameParameter);
		
		// pubsub.publish first argument is the triggername (eventname), second argument is event payload
		// the event payload must have the same form as the subscription return value. So in our case it has to be a Match
		// pubSub.publish('matchFound', { matchFound: match })
		return match;
	}

		// To subscripe to the same event as the resolver
	@Subscription((returns) => Match)
	matchFound() {
		return pubSub.asyncIterator('matchFound');
	}

	// To subscribe to some other event
	@Subscription(returns => Match, {
		name: 'matchFound1',
	})
	subscribeToMatchFound1() {
		return pubSub.asyncIterator('matchFound1');
	}
	
	// @Mutation(returns => )
}

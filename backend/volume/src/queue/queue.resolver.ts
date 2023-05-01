import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { QueueService } from './queue.service';
import { Queue } from './queue.model'
import { Match } from './match.model'
import { queue } from 'rxjs';

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

	
	@Mutation((returns) => Boolean)
	async joinGlobalQueue(
		@Args('username', { type: () => String }) usernameParameter: string,
	) {
		const match = this.queueService.join(usernameParameter);
		
		if (match.foundMatch)
		{
			pubSub.publish('matchFound', { matchFound: match });
			console.log("match found: %s vs %s pubsub.publish called", match.playerOneName, match.playerTwoName)	
		} else {
			console.log("%s added to the queue", usernameParameter);
		}
		return match.foundMatch;
	}

	
	@Subscription((returns) => Match)
	matchFound() {
		return pubSub.asyncIterator('matchFound');
	}







	@Subscription((returns) => Match, {
		filter: (payload, variables) => payload.playerTwoName === variables.queue_number,
	})
	filterSub(@Args('queue_number') queue_number: string) {
		return pubSub.asyncIterator('filterSub');
	}




	@Mutation(returns => Boolean)
	async testFilterMutation(@Args('queue_nub') queue_nub: String) {
		// let match1 = new Match;
		// match1.foundMatch = true;
		// match1.playerOneName = "test1";
		// match1.playerTwoName = queue_nub;
		
		const match1 = this.queueService.testCreateMatch();

		pubSub.publish('filterSub', match1 );
		return false;
	}

	@Subscription((returns) => Match, {	
		filter: (match1: Match , queue_nb) => match1.playerTwoName === queue_nb.queue_nb
	})
	testFilterSubcription(@Args('queue_nb') queue_nb: string){
		return pubSub.asyncIterator('testFilterSubscription')
	}
}	

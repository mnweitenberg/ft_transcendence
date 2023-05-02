import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}



	
	// @Mutation((returns) => Boolean)
	// async joinGlobalQueue(
	// 	@Args('username', { type: () => String }) usernameParameter: string,
	// ) {
	// 	const match = this.queueService.join(usernameParameter);
		
	// 	if (match.foundMatch)
	// 	{
	// 		pubSub.publish('matchFound', { matchFound: match });
	// 		console.log("match found: %s vs %s pubsub.publish called", match.playerOneName, match.playerTwoName)	
	// 	} else {
	// 		console.log("%s added to the queue", usernameParameter);
	// 	}
	// 	return match.foundMatch;
	// }

	
	// @Subscription((returns) => Match)
	// matchFound() {
	// 	return pubSub.asyncIterator('matchFound');
	// }




		
	@Mutation((returns) => Boolean)
	async mutationSub(
		@Args('username', { type: () => String }) usernameParameter: string,) {
		return this.queueService.join(usernameParameter);
	}

	// @Mutation((returns) => Boolean)
	// async mutationSub(
	// 	@Args('username', { type: () => String }) usernameParameter: string,) {
	// 	const match = this.queueService.join(usernameParameter);
		
	// 	if (match.foundMatch) {
	// 		pubSub.publish('filterSub', { filterSub: match } );
	// 	}
	// 	return match.foundMatch;
	// }

	@Subscription((returns) => Match, { 
		filter: (payload, variable) => {
			return ((payload.matchFound.playerOneId === variable.playerId) || (payload.matchFound.playerTwoId === variable.playerId));
		}
	})
	matchFound(@Args('playerId') playerId: string) {
		return pubSub.asyncIterator('matchFound');
	}





	@Subscription((returns) => Match, {
		filter: (payload, variables) => {
			console.log(payload.filterSub)
			return payload.filterSub.playerTwoName === variables.queue_number
		} 
	})
	filterSub(@Args('queue_number') queue_number: string) {
		return pubSub.asyncIterator('filterSub');
	}



	/* 
	DEBUGGING	
	*/
	@Query((returns) => [Queue])
	printQueue()
	{
		return this.queueService.printQ();
	}
}	

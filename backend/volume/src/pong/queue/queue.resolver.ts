import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { pubSub } from 'src/app.module';
import { Match } from '../match/entities/match.entity';
import { QueuedMatch } from './queuedmatch.model';



@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@Mutation((returns) => QueuedMatch, { nullable: true })
	async joinQueue(@Args('user_id') user_id: string) {
		return this.queueService.joinQueue(user_id);
	}

	@Subscription((returns) => QueuedMatch)
	matchFound() {
		return pubSub.asyncIterator('matchFound');
	}

	@Query((returns) => [QueuedMatch])
	async getWholeQueue(): Promise<QueuedMatch[]> {
		return this.queueService.getWholeQueue();
	}

	// Returns first match to be played
	@Query((returns) => QueuedMatch, { nullable: true })
	getQueuedMatch() {
		return this.queueService.getQueuedMatch();
	}

	/*
	TESTING
	*/
	
	@Query((returns) => Number)
	createMatches() {
		return this.queueService.createMatches();
	}

	@Query((returns) => Number)
	fillDbUser() {
		return this.queueService.fillDbUser();
	}

	@Query((returns) => Number)
	printQueue() {
		return this.queueService.queuePrint();
	}

	@Query((returns) => Number)
	removeQueue() {
		return this.queueService.removeQueue();
	}
}

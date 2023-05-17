import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { pubSub } from 'src/app.module';
import { Match } from '../match/entities/match.entity';

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@Mutation((returns) => Match, { nullable: true })
	joinQueue(@Args('user_id') user_id: string) {
		return this.queueService.lookForMatch(user_id);
	}

	@Subscription((returns) => Match, {
		filter: (payload, variable) => {
			return (
				payload.gameScoreFound.playerOne.user_id === variable.user_id ||
				payload.gameScoreFound.playerTwo.user_id === variable.user_id
			);
		},
	})
	matchFound(@Args('user_id') user_id: string) {
		return pubSub.asyncIterator('matchFound');
	}

	@Query((returns) => [Match])
	async getQueueQuery(): Promise<Match[]> {
		return this.queueService.getQueue();
	}






	/*
	TESTING
	*/

	@Query((returns) => Number)
	createMatchesQuery() {
		return this.queueService.createMatches();
	}

	@Query((returns) => Number)
	fillDbUserQuery() {
		return this.queueService.fillDbUser();
	}

	@Query((returns) => Number)
	printQueue() {
		return this.queueService.queuePrint();
	}
}

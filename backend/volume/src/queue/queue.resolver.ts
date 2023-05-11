import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';
import { GameScore, UserGame } from './entities/gamescore.entity';

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}


	@Mutation((returns) => GameScore, { nullable: true })
	joinQueue(@Args('user_id') user_id: string) {
		return this.queueService.lookForMatch(user_id);
	}
	
	@Subscription((returns) => GameScore, {
		filter: (payload, variable) => {
			return (
				payload.gameScoreFound.playerOne.user_id === variable.user_id ||
				payload.gameScoreFound.playerTwo.user_id === variable.user_id
			);
		},
	})
	gameScoreFound(@Args('user_id') user_id: string) {
		return pubSub.asyncIterator('gameScoreFound');
	}

	@Query((returns) => [GameScore])
	async currentQueueQuery() : Promise<GameScore[]> {
		return this.queueService.currentQueue();
	}


	

	/*
	REMOVE
	*/

	@Subscription((returns) => Match, {
		filter: (payload, variable) => {
			return (
				payload.matchFound.playerOneId === variable.user_id ||
				payload.matchFound.playerTwoId === variable.user_id
			);
		},
	})
	matchFound(@Args('user_id') user_id: string) {
		return pubSub.asyncIterator('matchFound');
	}




	/*
	TESTING
	*/

	@Query((returns) => Number)
	create3matchesQuery() {
		return this.queueService.createMatches();
	}

	@Query((returns) => Number) 
	fillDbUserGameQuery() {
		return this.queueService.fillDbUserGame();
	}

	@Query((returns) => Number)
	printQueue() {
		return this.queueService.queuePrint();
	}

}

import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';
import { GamerScore, UserGame } from './entities/gamerscore.entity';

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	// TODO joinQueue moet complete GamerScore returnen bij gevonden match
	@Mutation((returns) => Match, { nullable: true })
	joinQueue(@Args('userId') userId: string) {
		return this.queueService.lookForMatch(userId);
	}

	// TODO dit moet ook complete gamerscore returnen
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
	// @Mutation(returns => GamerScore)
	// createGScore(@Args('userId') userId:string) {
	// 	return this.queueService.createGamerScore();
	// }
	@Mutation(returns => GamerScore)
	createGScore(@Args('player1Id') playerOneId:string, @Args('player2Id')playerTwoId: string) {
		return this.queueService.createGame(playerOneId, playerTwoId);
	}

	@Mutation(returns => UserGame)
	createUserGame(@Args('userId') userid: string)
	{
		return this.queueService.userGameCreate(userid);
	}

	@Mutation(returns => UserGame)
	createRandomUserGame(@Args('some') some:string) {
		return this.queueService.randomUserGame(some);
	}
}

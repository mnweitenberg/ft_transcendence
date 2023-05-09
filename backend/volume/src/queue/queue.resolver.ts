import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';
import { GamerScore, UserGame } from './entities/gamerscore.entity';

// TODO gamERscore moet zijn gamEscore

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@Mutation((returns) => GamerScore, { nullable: true })
	joinQueue(@Args('user_id') user_id: string) {
		return this.queueService.lookForMatch(user_id);
	}

	@Subscription((returns) => GamerScore, {
		filter: (payload, variable) => {
			return (
				payload.gamerScoreFound.playerOne.user_id === variable.user_id ||
				payload.gamerScoreFound.playerTwo.user_id === variable.user_id
			);
		},
	})
	gamerScoreFound(@Args('user_id') user_id: string) {
		return pubSub.asyncIterator('gamerScoreFound')
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
	createRandomUserGame(@Args('name') name:string, @Args('minus')minus:number) {
		return this.queueService.randomUserGame(name, minus);
	}
}

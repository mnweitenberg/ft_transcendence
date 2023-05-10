import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
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
		return pubSub.asyncIterator('gameScoreFound')
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

	@Mutation(returns => GameScore)
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

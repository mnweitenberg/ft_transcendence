import { Resolver, Subscription } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Match } from './entities/match.entity';
import { MatchRepository } from './match.repository';
import { Query } from '@nestjs/graphql';

@Resolver()
export class MatchResolver {
	constructor(
		private readonly matchRepo: MatchRepository,
	) {}

	@Subscription(() => [Match])
	matchHistoryHasBeenUpdated() {
		console.log('matchHistoryHasBeenUpdated');
		return pubSub.asyncIterator('matchHistoryHasBeenUpdated');
	}

	@Query(() => [Match])
	async getInitialMatchHistory() {
	  const matches = await this.matchRepo.findAll();
	  console.log('getInitialMatchHistory', matches);
	  return matches;
  }

}

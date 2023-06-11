import { Resolver, Subscription } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Match } from './entities/match.entity';
import { MatchRepository } from './match.repository';
import { Query } from '@nestjs/graphql';
import { MatchService } from './match.service';

@Resolver()
export class MatchResolver {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly matchService: MatchService,
	) {}

	@Query(() => [Match])
	async getInitialMatchHistory() {
		console.log('getInitialMatchHistory');
		const matchHistory = await this.matchRepo.findAll();
		matchHistory.forEach(match => console.log(JSON.stringify(match, null, 2)));
		return matchHistory;
	}

	@Subscription(() => [Match])
	matchHistoryHasBeenUpdated() {
		console.log('matchHistoryHasBeenUpdated');
		return pubSub.asyncIterator('matchHistoryHasBeenUpdated');
	}
}

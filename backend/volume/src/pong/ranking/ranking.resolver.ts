import { Resolver, Subscription, Query } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Ranking } from './entities/ranking.entity';
import { RankingService } from './ranking.service';

@Resolver()
export class RankingResolver {
	constructor (private rankingService: RankingService) {};

	@Subscription(() => [Ranking])
	rankingHasBeenUpdated() {
		console.log('rankingHasBeenUpdated');
		return pubSub.asyncIterator('rankingHasBeenUpdated');
	}

	@Query(() => [Ranking])
	getRanking() {
		return this.rankingService.getRanking();
	}
}

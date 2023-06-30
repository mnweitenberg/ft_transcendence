import { Resolver, Subscription, Query, Args } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Ranking } from './entities/ranking.entity';
import { RankingRepository } from './ranking.repository';

@Resolver()
export class RankingResolver {
	constructor(private readonly rankingRepo: RankingRepository) {}

	@Subscription(() => [Ranking])
	rankingHasBeenUpdated() {
		return pubSub.asyncIterator('rankingHasBeenUpdated');
	}

	@Query(() => [Ranking])
	async getRanking() {
		return await this.rankingRepo.findAll();
	}

	@Query(() => Ranking, { nullable: true })
	async getStats(@Args('userId', { type: () => String }) userId: string) {
		return await this.rankingRepo.getRankingByUser(userId);
	}
}

import { Resolver, Subscription } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Ranking } from './entities/ranking.entity';

@Resolver()
export class RankingResolver {
	@Subscription(() => [Ranking])
	rankingHasBeenUpdated() {
		console.log('rankingHasBeenUpdated');
		return pubSub.asyncIterator('rankingHasBeenUpdated');
	}
}

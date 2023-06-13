import { Resolver, Subscription } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Match } from './entities/match.entity';
import { Query } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { Args } from '@nestjs/graphql';

@Resolver()
export class MatchResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => [Match])
	async getInitialMatchHistory(
		@Args('userId', { type: () => String }) userId: string,
	) {
		const user = await this.userService.getUserById(userId);
		const matchHistory = await this.userService.getMatchHistory(user);
		return matchHistory;
	}

	@Subscription(() => [Match], {
		filter: ({ matchHistoryHasBeenUpdated }, _, { user }) => {
			if (!matchHistoryHasBeenUpdated) return false;
			return matchHistoryHasBeenUpdated.id === user.id;
		},
	})
	matchHistoryHasBeenUpdated(
		@Args('userId', { type: () => String }) userId: string,
	) {
		return pubSub.asyncIterator(`matchHistoryHasBeenUpdated:${userId}`);
	}
}

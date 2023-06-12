import { Resolver, Subscription } from '@nestjs/graphql';
import { pubSub } from 'src/app.module';
import { Match } from './entities/match.entity';
import { MatchRepository } from './match.repository';
import { Query } from '@nestjs/graphql';
import { MatchService } from './match.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Resolver()
export class MatchResolver {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly matchService: MatchService,
		private readonly userService: UserService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Query(() => [Match])
	async getInitialMatchHistory(@AuthUser() userInfo: UserInfo) {
		// console.log('getInitialMatchHistory');
		const user = await this.userService.getUserById(userInfo.userUid);
		const matchHistory = await this.userService.getMatchHistory(user);
		// matchHistory.forEach((match) =>
		// 	console.log(JSON.stringify(match, null, 2)),
		// );
		return matchHistory;
	}

	@Subscription(() => [Match])
	matchHistoryHasBeenUpdated() {
		// console.log('matchHistoryHasBeenUpdated');
		return pubSub.asyncIterator('matchHistoryHasBeenUpdated');
	}
}

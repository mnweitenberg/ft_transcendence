import { Injectable } from '@nestjs/common';
import { MatchRepository } from 'src/pong/match/match.repository';
import { UserService } from 'src/user/user.service';
import { pubSub } from 'src/app.module';

@Injectable()
export class MatchService {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly userService: UserService,
	) {}

	// @UseGuards(JwtAuthGuard)
	async updateMatchHistory() {
		console.log('UPDATE MATCH HISTORY');
		const matches = await this.matchRepo.findAll();
		pubSub.publish('matchHistoryHasBeenUpdated', {
			matchHistoryHasBeenUpdated: matches,
		});
	}
}

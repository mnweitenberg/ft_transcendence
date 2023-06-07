import { Injectable } from '@nestjs/common';
import { MatchRepository } from 'src/pong/match/match.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RankingService {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly userService: UserService,
	) {
		this.printAllMatches();
	}

	async printAllMatches() {
		const matches = await this.matchRepo.findAll();
		for (const match of matches) {
			console.log('match score\t:', match.p1Score, match.p2Score);
			console.log('match players\t:', match.players);
		}

		const users = await this.userService.getAllUsers();
		for (const user of users) {
			// get all matches by a certain user
			// const matches = await this.matchRepo.getMatchesByUserUid(user.id);

			console.log('user\t:', user.username);
			// console.log('matches\t:', matches);
		}
	}
}

// function updateRanking(match: i.GameScore) {
// 	if (match.score.p1 > match.score.p2) {
// 		match.p1.stats.wins += 1;
// 		match.p1.stats.score += 3;
// 		match.p2.stats.losses += 1;
// 		match.p2.stats.score -= 1;
// 	} else {
// 		match.p2.stats.wins += 1;
// 		match.p2.stats.score += 3;
// 		match.p1.stats.losses += 1;
// 		match.p1.stats.score -= 1;
// 	}
// 	// sort users based on their stats
// 	ranking.sort((a, b) => b.user.stats.score - a.user.stats.score);
// 	// update ranks
// 	ranking.forEach((item, index) => {
// 		item.rank = index + 1;
// 		item.user.stats.ranking = index + 1;
// 	});
// }

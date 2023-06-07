import { Injectable } from '@nestjs/common';
import { MatchRepository } from 'src/pong/match/match.repository';

@Injectable()
export class RankingService {
	constructor(private readonly matchRepo: MatchRepository) {
		this.printAllMatches();
	}
	matches = this.matchRepo.findAll();

	printAllMatches() {
		console.log('matches :', this.matches);
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

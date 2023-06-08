import { Injectable } from '@nestjs/common';
import { MatchRepository } from 'src/pong/match/match.repository';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Match } from 'src/pong/match/entities/match.entity';
import { RankingRepository } from './ranking.repository';
import { Ranking } from './entities/ranking.entity';
import { pubSub } from 'src/app.module';

@Injectable()
export class RankingService {
	constructor(
		private readonly rankingRepo: RankingRepository,
		private readonly matchRepo: MatchRepository,
		private readonly userService: UserService,
	) {
		this.updateRanking();
	}

	async updateRanking() {
		const users = await this.userService.getAllUsers();
		console.log('UPDATE RANKING');
		for (const user of users) {
			// console.log('user\t:', user.username);

			let ranking = await this.rankingRepo.getRankingByUser(user);
			if (!ranking) {
				ranking = new Ranking();
				ranking.user = user;
				ranking.rank = 0;
			}

			const matches = await this.userService.getMatchHistory(user);
			const matchesThatHaveBeenCalculated = ranking.wins + ranking.losses;
			// console.log('matches\t:', matches);
			for (
				let i = matchesThatHaveBeenCalculated;
				i < matches.length;
				i++
			) {
				// console.log(matches[i].players);
				const winner = await this.findWinner(matches[i]);
				if (winner.id === user.id) {
					ranking.wins += 1;
					ranking.score += 3;
				} else {
					ranking.losses += 1;
					ranking.score -= 1;
				}
				// console.log(ranking);
				
					await this.rankingRepo.saveRanking(ranking);
				
					
			}
		}
		await this.determineRankingOrder();
	}

	async findWinner(match: Match): Promise<User> {
		
		const [p1, p2] = await this.matchRepo.getPlayersInMatch(match);
		console.log(p1, p2)
		if (match.p1Score > match.p2Score) return p1;
		else return p2;
	}

	async determineRankingOrder() {
		const ranking = await this.rankingRepo.findAll();
		ranking.sort((a, b) => b.score - a.score);
		for (const rank in ranking) {
			ranking[rank].rank = parseInt(rank) + 1;
	
			await this.rankingRepo.saveRanking(ranking[rank]);
		}
		// console.log(ranking);
		
		pubSub.publish('rankingHasBeenUpdated', {
			rankingHasBeenUpdated: ranking,
		});
	}
}

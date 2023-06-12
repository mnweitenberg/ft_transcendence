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
		// this.recalculateTotalRanking();
	}

	async updateRanking(match: Match, p1: User, p2: User) {
		console.log('UPDATE RANKING');
		const players = [p1, p2];
		await this.updatePlayerStats(match, players);
		await this.determineRankingOrder();
	}

	async recalculateTotalRanking() {
		console.log('recalculateTotalRanking');
		const users = await this.userService.getAllUsers();
		for (const user of users) {
			const ranking = await this.retrieveOrCreateRanking(user);
			ranking.rank = 0;
			ranking.wins = 0;
			ranking.losses = 0;
			ranking.score = 1200;
			await this.rankingRepo.saveRanking(ranking);
		}

		const matches = await this.matchRepo.findAll();
		for (const match in matches) {
			const players = await this.matchRepo.getPlayersInMatch(
				matches[match],
			);
			await this.updatePlayerStats(matches[match], players);
		}
		await this.determineRankingOrder();
	}

	async retrieveOrCreateRanking(user: User): Promise<Ranking> {
		let ranking = await this.rankingRepo.getRankingByUser(user.id);
		if (!ranking) {
			ranking = new Ranking();
			ranking.user = user;
		}
		return ranking;
	}

	async updatePlayerStats(match: Match, players: User[]) {
		const [winner, loser] = await this.findWinner(match, players);
		if (!winner || !loser) return;
		const winnerRanking = await this.retrieveOrCreateRanking(winner);
		const loserRanking = await this.retrieveOrCreateRanking(loser);

		const winnerExpected = this.calculateExpectedScore(
			winnerRanking,
			loserRanking,
		);
		const loserExpected = this.calculateExpectedScore(
			loserRanking,
			winnerRanking,
		);

		const K = 32;
		winnerRanking.wins += 1;
		winnerRanking.score = Math.round(
			winnerRanking.score + K * (1 - winnerExpected),
		);
		loserRanking.losses += 1;
		loserRanking.score = Math.round(
			loserRanking.score + K * (0 - loserExpected),
		);

		await this.rankingRepo.saveRanking(winnerRanking);
		await this.rankingRepo.saveRanking(loserRanking);
	}

	async findWinner(match: Match, players: User[]): Promise<User[]> {
		if (match.p1Score > match.p2Score) return [players[0], players[1]];
		return [players[1], players[0]];
	}

	calculateExpectedScore(ranking1: Ranking, ranking2: Ranking): number {
		return 1 / (1 + 10 ** ((ranking2.score - ranking1.score) / 400));
	}

	async determineRankingOrder() {
		const ranking = await this.rankingRepo.findAll();
		ranking.sort((a, b) => b.score - a.score);
		for (const rank in ranking) {
			ranking[rank].rank = parseInt(rank) + 1;
			await this.rankingRepo.saveRanking(ranking[rank]);
		}
		console.log('rank\tscore\twins\tlosses\tname:');
		for (const rank of ranking) {
			if (!rank.user) continue;
			console.log(
				rank.rank,
				'\t',
				rank.score,
				'\t',
				rank.wins,
				'\t',
				rank.losses,
				'\t',
				rank.user.username,
			);
		}
		pubSub.publish('rankingHasBeenUpdated', {
			rankingHasBeenUpdated: ranking,
		});
	}
}

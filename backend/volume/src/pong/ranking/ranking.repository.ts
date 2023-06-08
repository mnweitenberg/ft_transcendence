import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectRepository(Ranking)
		private readonly rankingRepo: Repository<Ranking>,
	) {}

	public async findAll(): Promise<Ranking[]> {
		return this.rankingRepo.find({relations: { user: true }});
	}

	public async getRankingByUser(user: User): Promise<Ranking> {
		if (!user) throw new Error('User not found');
		return await this.rankingRepo.findOne({ where: { user: user } });
	}

	// async getPlayersInMatch(match: Match): Promise<Array<User>> {
	// 	const userMatchHistory = await this.matchRepo.findOne({
	// 		relations: { players: true },
	// 		where: { gameId: match.gameId },
	// 	});
	// 	return userMatchHistory.players;
	// }

	public async saveRanking(ranking: Ranking): Promise<Ranking> {
		if (!ranking) throw new Error('No ranking received');
		// const players: User[] = await this.checkPlayers(match.players);
		// if (!players || !players[0] || !players[1]) return;
		// await this.addMatchToPlayerHistory(match, players[0].id);
		// await this.addMatchToPlayerHistory(match, players[1].id);
		return this.rankingRepo.save(ranking);
	}
}

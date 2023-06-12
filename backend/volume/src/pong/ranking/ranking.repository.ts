import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class RankingRepository {
	constructor(
		@InjectRepository(Ranking)
		private readonly rankingRepo: Repository<Ranking>,
		private readonly userService: UserService,
	) {}

	public async findAll(): Promise<Ranking[]> {
		return this.rankingRepo.find({ relations: { user: true } });
	}

	public async getRankingByUser(userId: string): Promise<Ranking> {
		const user = await this.userService.getUserById(userId);
		if (!user) throw new Error('User not found');
		return await this.rankingRepo.findOne({ where: { user: user } });
	}

	public async saveRanking(ranking: Ranking): Promise<Ranking> {
		if (!ranking) throw new Error('No ranking received');
		return this.rankingRepo.save(ranking);
	}
}

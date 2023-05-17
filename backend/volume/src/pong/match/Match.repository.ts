import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchRepository {
	constructor(
		@InjectRepository(Match)
		private readonly MatchRepository: Repository<Match>,
	) {}

	public async findAllMatches(): Promise<Match[]> {
		return this.MatchRepository.find();
	}

	// public async findMatchById(id: string): Promise<Match> {
	//   return this.MatchRepository.findOne(id);
	// }

	public async saveMatch(Match: Match): Promise<Match> {
		return this.MatchRepository.save(Match);
	}
}

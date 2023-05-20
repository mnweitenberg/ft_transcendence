import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { QueueService } from '../queue/queue.service';
import * as i from '../pongLogic/interfaces';

@Injectable()
export class MatchRepository {
	constructor(
		@InjectRepository(Match)
		private readonly matchRepo: Repository<Match>,
		private readonly queueService: QueueService
	) {}

	public async findAll(): Promise<Match[]> {
		return this.matchRepo.find();
	}

	public async saveMatch(match: Match): Promise<Match> {
		return this.matchRepo.save(match);
	}

	public async initNewMatch(): Promise<i.Match> {
		const queuedMatch = this.queueService.getQueuedMatch();
		console.log(queuedMatch);
		if (!queuedMatch) return;
		const match: i.Match = {
			id: 0,
			playerOne: queuedMatch.playerOne,
			playerTwo: queuedMatch.playerTwo,
			score: {
				playerOne: 0,
				playerTwo: 0,
			},
		};
		return match;
	}
}

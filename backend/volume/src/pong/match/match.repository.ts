import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { QueueService } from '../queue/queue.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class MatchRepository {
	constructor(
		@InjectRepository(Match)
		private readonly matchRepo: Repository<Match>,
		private readonly queueService: QueueService,
		private readonly userService: UserService,
	) {}

	public async findAll(): Promise<Match[]> {
		return this.matchRepo.find();
	}

	public async saveMatch(match: Match): Promise<Match> {
		if (!match) throw new Error('No score received');

		const playerOne = await this.userService.getUserById(match.players[0].id);
		const playerTwo = await this.userService.getUserById(match.players[1].id);
		if (!playerOne || !playerTwo)
			throw new Error("One or more users don't exist in the database");

		await this.addMatchToPlayerHistory(match, match.players[0].id);
		await this.addMatchToPlayerHistory(match, match.players[1].id);
		return this.matchRepo.save(match);
	}

	private async addMatchToPlayerHistory(match: Match, id: string): Promise<void> {
		const user = await this.userService.getUserById(id);
		if (user.match_history) user.match_history.push(match);
		else user.match_history = [match];
		await this.userService.save(user);
	}

	public async initNewMatch(): Promise<Match> {
		const queuedMatch = this.queueService.getQueuedMatch();
		console.log(queuedMatch);
		if (!queuedMatch) return;
		const match = new Match();
		match.players = [queuedMatch.playerOne, queuedMatch.playerTwo];
		match.playerOneScore = 0;
		match.playerTwoScore = 0;
		return match;
	}
}

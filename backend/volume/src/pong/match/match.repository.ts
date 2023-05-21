import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { QueueService } from '../queue/queue.service';
import * as i from '../interfaces';
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

	public async saveMatch(match: i.Match): Promise<Match> {
		if (!match) throw new Error('No score received');

		const playerOne = await this.userService.getUserById(match.playerOne.id);
		const playerTwo = await this.userService.getUserById(match.playerTwo.id);

		if (!playerOne || !playerTwo)
			throw new Error("One or more users don't exist in the database");

		const matchEntity = await this.prepareMatchEntity(match);
		await this.addMatchToPlayerHistory(matchEntity);
		return this.matchRepo.save(matchEntity);
	}

	private async prepareMatchEntity(match: i.Match): Promise<Match> {

		const matchEntity = new Match();
		matchEntity.players = [match.playerOne, match.playerTwo];
		matchEntity.playerOneScore = match.score.playerOne;
		matchEntity.playerTwoScore = match.score.playerTwo;
		return matchEntity;
	}

	private async addMatchToPlayerHistory(match: Match): Promise<void> {
		const playerOne = await this.userService.getUserById(match.players[0].id);
		const playerTwo = await this.userService.getUserById(match.players[1].id);
	
		if (playerOne.match_history)
			playerOne.match_history.push(match);
		else
			playerOne.match_history = [match];
	
		if (playerTwo.match_history)
			playerTwo.match_history.push(match);
		else
			playerTwo.match_history = [match];
	
		await this.userService.save(playerOne);
		await this.userService.save(playerTwo);
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

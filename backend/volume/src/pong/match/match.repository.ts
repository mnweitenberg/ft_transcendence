import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class MatchRepository {
	constructor(
		@InjectRepository(Match)
		private readonly matchRepo: Repository<Match>,
		private readonly userService: UserService,
		private readonly queueService: QueueService,
	) {}

	public async findAll(): Promise<Match[]> {
		return this.matchRepo.find();
	}

	// public async getMatchesByUserUid(userUid: string): Promise<Match[]> {
	// 	const user = await this.userService.getUserById(userUid);
	// 	if (!user) throw new Error('User not found');
	// 	return user.match_history;
	// }
	async getPlayersInMatch(match: Match): Promise<Array<User>> {
		const userMatchHistory = await this.matchRepo.findOne({
			relations: { players: true },
			where: { gameId: match.gameId },
		});
		console.log(userMatchHistory.players);
		return userMatchHistory.players;
	}

	public async saveMatch(match: Match): Promise<Match> {
		if (!match) throw new Error('No score received');
		const players: User[] = await this.checkPlayers(match.players);
		if (!players || !players[0] || !players[1]) return;
		await this.addMatchToPlayerHistory(match, players[0].id);
		await this.addMatchToPlayerHistory(match, players[1].id);
		return this.matchRepo.save(match);
	}

	private async addMatchToPlayerHistory(
		match: Match,
		id: string,
	): Promise<void> {
		const user = await this.userService.getUserById(id);
		if (user.match_history) user.match_history.push(match);
		else user.match_history = [match];
		await this.userService.save(user);
	}

	public async initNewMatch(): Promise<Match> {
		const queuedMatch = this.queueService.getQueuedMatch();
		if (!queuedMatch) return;
		const match = new Match();
		match.players = [queuedMatch.p1, queuedMatch.p2];
		match.p1Score = 0;
		match.p2Score = 0;
		match.isFinished = false;
		return match;
	}

	private async checkPlayers(players: User[]): Promise<User[]> {
		const p1 = await this.userService.getUserById(players[0].id);
		const p2 = await this.userService.getUserById(players[1].id);
		return [p1, p2];
	}
}

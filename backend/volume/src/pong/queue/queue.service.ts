import { Injectable } from '@nestjs/common';
import { pubSub } from 'src/app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { User } from '../../user/entities/user.entity';
import { Ranking } from '../../pong/ranking/entities/ranking.entity';

const DEBUG_PRINT = true;

@Injectable()
export class QueueService {
	constructor(
		@InjectRepository(Match)
		private readonly matchRepo: Repository<Match>,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		@InjectRepository(Ranking)
		private readonly rankingRepo: Repository<Ranking>,
	) {}

	static match_id: number;
	users_looking_for_match: string[] = [];
	queue_matches: Match[] = [];

	
	async createGame(
		player_one_id: string,
		player_two_id: string,
	): Promise<Match> {
		const player_one = await this.userRepo.findOne({
			where: { id: player_one_id },
			relations: { ranking: true },
		});
		const player_two = await this.userRepo.findOne({
			where: { id: player_two_id },
			relations: { ranking: true },
		});

		const new_game = this.matchRepo.create();

		new_game.playerOneScore = 0;
		new_game.playerTwoScore = 0;

		new_game.players = [player_one, player_two];
		

		this.queue_matches.push(new_game); // redundant?
		this.matchRepo.save(new_game);

		return new_game;
	}

	getQueue(): Match[] {
		return this.queue_matches;
	}

	canPlayerLookForMatch(playerId: string): boolean {
		for (let i = 0; i < this.users_looking_for_match.length; i++)
			if (playerId == this.users_looking_for_match[i]) return false;

		// TODO:
		// Voeg check toe waarbij wordt gekeken of player niet al in een match zit
		// of een invite oid heeft verstuurd

		return true;
	}

	async lookForMatch(player_id: string): Promise<Match> | null {
		if (!this.canPlayerLookForMatch(player_id)) return null;

		for (let i = 0; i < this.users_looking_for_match.length; i++) {
			if (this.users_looking_for_match[i] != player_id) {
				const newGame = await this.createGame(
					this.users_looking_for_match[i],
					player_id,
				);
				this.users_looking_for_match.splice(i, 1);

				if (DEBUG_PRINT) {
					console.log('Found game: ', newGame);
				}
				pubSub.publish('matchFound', { MatchFound: newGame });
				return newGame;
			}
		}
		this.users_looking_for_match.push(player_id);
		return null;
	}

	/*
	TESTING	
	*/

	async createMatches() {
		let name : string = "Henk";
		let id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);

		name = "Henk1";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);
		name = "Henk2";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);
		name = "Henk3";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);
		name = "Henk4";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);
		name = "Henk5";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);

		return 4;
	}

	async fillDbUser() {
	this.randomUser('Henk', 1);
	this.randomUser('Henk1', 2);
	this.randomUser('Henk2', 3);
	this.randomUser('Henk3', 4);
	this.randomUser('Henk4', 5);
	this.randomUser('Henk5', 6);
	return 3;
	}

	queuePrint() {
		console.log('\t\t\t QUEUE op backend');
		console.log(this.users_looking_for_match);
		console.log('\t\t\t GAMESCORE queue');
		console.log(this.queue_matches);
		return 3;
	}

	async randomUser(name: string, minus: number) {
		const user = await this.userRepo.create();
		user.avatar = name + 'avatar';
		user.username = name;

		user.intraId = name + '_intra_id';
		// user.status = 'online';

		// const user_ranking = await this.rankingRepo.create();
		// user_ranking.losses = 322 - minus;
		// user_ranking.score = 344 - minus;
		// user_ranking.wins = 133 - minus;
		// user_ranking.rank = 999 - minus;
		// await this.rankingRepo.save(user_ranking);
		// user.ranking = user_ranking;

		return this.userRepo.save(user);
	}
}

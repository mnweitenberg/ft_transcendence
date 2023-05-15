import { Injectable } from '@nestjs/common';
import { pubSub } from 'src/app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { User } from '../../user/entities/user.entity';

const DEBUG_PRINT = true;

@Injectable()
export class QueueService {
	constructor(
		@InjectRepository(Match)
		private readonly gameScoreRepo: Repository<Match>,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	) {}

	static match_id: number;
	users_looking_for_match: string[] = [];
	queue_game_score: Match[] = [];

	async createGame(
		player_one_id: string,
		player_two_id: string,
	): Promise<Match> {
		const player_one = await this.userRepo.findOne({
			where: { id: player_one_id },
			// relations: { stats: true },
		});
		const player_two = await this.userRepo.findOne({
			where: { id: player_two_id },
			// relations: { stats: true },
		});

		const new_game = new Match();

		new_game.playerOneScore = 0;
		new_game.playerTwoScore = 0;
		new_game.playerOne = player_one;
		new_game.playerTwo = player_two;

		this.queue_game_score.push(new_game);

		return new_game;
	}

	currentQueue(): Match[] {
		return this.queue_game_score;
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
					// console.log(newGame.playerOne.stats.losses);
					// console.log(newGame.playerTwo.stats.losses);
				}
				pubSub.publish('gameScoreFound', { MatchFound: newGame });
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
		// this.fillDbUserGame();
		await this.lookForMatch('Henk');
		await this.lookForMatch('Henk1');
		await this.lookForMatch('Henk2');
		await this.lookForMatch('Henk3');
		await this.lookForMatch('Henk4');
		await this.lookForMatch('Henk5');
		return 4;
	}

	// async fillDbUserGame() {
	// this.randomUserGame('Henk', 1);
	// this.randomUserGame('Henk1', 2);
	// this.randomUserGame('Henk2', 3);
	// this.randomUserGame('Henk3', 4);
	// this.randomUserGame('Henk4', 5);
	// this.randomUserGame('Henk5', 6);
	// return 3;
	// }

	queuePrint() {
		console.log('\t\t\t QUEUE op backend');
		console.log(this.users_looking_for_match);
		console.log('\t\t\t GAMESCORE queue');
		console.log(this.queue_game_score);
		return 3;
	}

	// async randomUserGame(name: string, minus: number) {
	// 	const userGame = await this.userRepo.create();
	// 	userGame.avatar = name + 'avatar';
	// 	userGame.name = name + ' name';
	// 	userGame.userId = name;
	// 	userGame.status = 'online';

	// 	const userStats = await this.statsRepository.create();
	// 	userStats.losses = 322 - minus;
	// 	userStats.ranking = 523 - minus;
	// 	userStats.score = 344 - minus;
	// 	userStats.wins = 133 - minus;

	// 	await this.statsRepository.save(userStats);
	// 	userGame.stats = userStats;

	// 	return this.userRepo.save(userGame);
	// }
}

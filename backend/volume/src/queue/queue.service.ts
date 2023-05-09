import { Injectable } from '@nestjs/common';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGame, GamerScore, Score, Stats } from './entities/gamerscore.entity';
import { Repository } from 'typeorm';


const DEBUG_PRINT = true;

export var queue: Queue[] = [];

@Injectable()
export class QueueService {
	constructor(
		@InjectRepository(GamerScore)
		private readonly gamerScoreRepo: Repository<GamerScore>,
		@InjectRepository(UserGame)
		private readonly userGameRepository: Repository<UserGame>,
		@InjectRepository(Stats)
		private readonly statsRepository: Repository<Stats>,
	) {}

	async createGame(player_one_id: string, player_two_id: string) : Promise<GamerScore> {
		
		const player_one = await this.userGameRepository.findOne({
							where: {userId: player_one_id}
						});
		const player_two = await this.userGameRepository.findOne({
							where: {userId: player_two_id}
						});

		// TODO 
		// stats etc lijken nog niet gelinkt te worden, in database is dat wel zo

		const newGame = new GamerScore();
		const score = new Score();

		newGame.score = score;
		newGame.playerOne = player_one;
		newGame.playerTwo = player_two;

		return newGame;
	}

	canPlayerLookForMatch(playerId: string): boolean {
		for (let i = 0; i < queue.length; i++)
			if (playerId == queue[i].playerId) return false;

		// TODO
		// Voeg check toe waarbij wordt gekeken of player niet al in een match zit
		// of een invite oid heeft verstuurd

		return true;
	}

	async lookForMatch(player_id: string): Promise<GamerScore> | null {
		if (!this.canPlayerLookForMatch(player_id)) return null;

		for (let i = 0; i < queue.length; i++) {
			if (queue[i].playerId != player_id) {
				const newGame = await this.createGame(queue[i].playerId, player_id);


				if (DEBUG_PRINT) {
					console.log('Found game: ', newGame);
					console.log(newGame.playerOne.stats);
					console.log(newGame.playerTwo.stats);
				}
				pubSub.publish('gamerScoreFound', { gamerScoreFound: newGame });
				return newGame;
			}
		}
		this.addToQueue(player_id);
		return null;
	}


	addToQueue(playerId: string) {
		const add = new Queue();
		add.playerId = playerId;
		if (DEBUG_PRINT) {
			console.log('Added to the queue: ', add);
		}
		queue.push(add);
	}


	/*
	TESTING	
	*/
	async userGameCreate(user_id: string) : Promise<UserGame> {
		const userGame = await this.userGameRepository.create();
		userGame.avatar = "";
		userGame.name = user_id;
		userGame.userId = user_id;
		userGame.status = "idle";

		return this.userGameRepository.save(userGame);
	}

	async randomUserGame(name: string, minus: number) {
		const userGame = await this.userGameRepository.create();
		userGame.avatar = name;
		userGame.name = name;
		userGame.userId = name;
		userGame.status = "idle";

		const userStats = this.statsRepository.create();
		userStats.losses = 322 - minus;
		userStats.ranking = 523 - minus;
		userStats.score = 344 - minus;
		userStats.wins = 133 - minus;

		userGame.stats = userStats;
		
		this.statsRepository.save(userStats);
		return this.userGameRepository.save(userGame);
	}
}

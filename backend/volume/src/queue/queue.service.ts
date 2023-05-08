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

	async createGame(playerOneId: string, playerTwoId: string) : Promise<GamerScore> {
		
		const player_one = await this.userGameRepository.findOne({
							where: {user_id: playerOneId}
						});
		const player_two = await this.userGameRepository.findOne({
							where: {user_id: playerTwoId}
						});

		const newGame = new GamerScore();
		const score = new Score();
		const stats = new Stats();

		// TODO add query to database voor stats, dit zou moeten kunnen via @JoinTable oid
		stats.losses = 9;
		stats.ranking = 11;
		stats.score = 38282;
		stats.wins = 3838;

	
		player_one.stats = stats;
		player_two.stats = stats;
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

	lookForMatch(playerId: string): Match | null {
		if (!this.canPlayerLookForMatch(playerId)) return null;

		for (let i = 0; i < queue.length; i++) {
			if (queue[i].playerId != playerId) {
				const match = new Match();
				match.matched = true;
				match.playerOneId = playerId;
				match.playerTwoId = queue[i].playerId;
				queue.splice(i, 1);
				if (DEBUG_PRINT) {
					console.log('Found match: ', match);
				}
				pubSub.publish('matchFound', { matchFound: match });
				return match;
			}
		}
		this.addToQueue(playerId);
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
	async userGameCreate(userid: string) : Promise<UserGame> {
		const userGame = await this.userGameRepository.create();
		userGame.avatar = "";
		userGame.name = userid;
		userGame.user_id = userid;
		userGame.status = "idle";

		return this.userGameRepository.save(userGame);
	}

	async randomUserGame(some: string) {
		const userGame = await this.userGameRepository.create();
		userGame.avatar = some;
		userGame.name = Math.random().toString(16).substr(2, 8);
		userGame.user_id = Math.random().toString(16).substr(2, 8);
		userGame.status = "idle";

		const userStats = this.statsRepository.create();
		userStats.losses = Math.random();
		userStats.ranking = Math.random();
		userStats.score = Math.random();
		userStats.wins = Math.random();

		userGame.stats = userStats;
		
		this.statsRepository.save(userStats);
		return this.userGameRepository.save(userGame);
	}
}

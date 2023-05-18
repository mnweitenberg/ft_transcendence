import { Injectable } from '@nestjs/common';
import { pubSub } from 'src/app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { User } from '../../user/entities/user.entity';
import { Ranking } from '../../pong/ranking/entities/ranking.entity';
import { QueuedMatch } from './queuedmatch.model';


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

	users_looking_for_match: string[] = [];
	queued_matches: QueuedMatch[] = [];

	async addQueuedMatch (
		player_one_id: string,
		player_two_id: string,
	) : Promise <QueuedMatch> {
		const player_one = await this.userRepo.findOne({
			where: { id: player_one_id },
			// relations: { ranking: true }, 
		});
		const player_two = await this.userRepo.findOne({
			where: { id: player_two_id },
			// relations: { ranking: true },
		});

		const new_queued_match = new QueuedMatch();
		new_queued_match.playerOne = player_one;
		new_queued_match.playerTwo = player_two;
		this.queued_matches.push(new_queued_match);

		pubSub.publish('matchFound', { matchFound: new_queued_match });

		return (new_queued_match);
	}
	
	async lookForMatch(player_id: string): Promise<QueuedMatch> | null {
		if (!this.canPlayerLookForMatch(player_id)) return null;

		for (let i = 0; i < this.users_looking_for_match.length; i++) {
			if (this.users_looking_for_match[i] != player_id) {

				const new_queued_match = await this.addQueuedMatch(
					this.users_looking_for_match[i],
					player_id,
				);
				this.users_looking_for_match.splice(i, 1);

				if (DEBUG_PRINT) {
					console.log('Found game: ', new_queued_match);
				}
				
				return (new_queued_match);
			}
		}
		this.users_looking_for_match.push(player_id);
		return null;
	}

	getQueuedMatch(): QueuedMatch | null {
		const top_match = this.queued_matches.at(0);
		this.queued_matches.splice(0, 1);
		return (top_match);
	}

	
	// FIXME: code voor bij pong game
	// async createGame(
	// 	player_one_id: string,
	// 	player_two_id: string,
	// ): Promise<Match> {
	// 	const player_one = await this.userRepo.findOne({
	// 		where: { id: player_one_id },
	// 		relations: { ranking: true },
	// 	});
	// 	const player_two = await this.userRepo.findOne({
	// 		where: { id: player_two_id },
	// 		relations: { ranking: true },
	// 	});

	// 	const new_game = this.matchRepo.create();

	// 	new_game.playerOneScore = 0;
	// 	new_game.playerTwoScore = 0;

	// 	new_game.players = [player_one, player_two];
		
	// 	// this.queue_matches.push(new_game); // redundant?
	// 	// this.matchRepo.save(new_game);

	// 	return new_game;
	// }

	getWholeQueue() {
		return this.queued_matches;
	}

	canPlayerLookForMatch(playerId: string): boolean {
		for (let i = 0; i < this.users_looking_for_match.length; i++)
			if (playerId === this.users_looking_for_match[i]) return false;
		for (let i = 0; i < this.queued_matches.length; i++)
			if (playerId === this.queued_matches[i].playerOne.id || 
				playerId === this.queued_matches[i].playerTwo.id) return false;


		// TODO:
		// Voeg check toe waarbij wordt gekeken of player niet al in een match zit
		// of een invite oid heeft verstuurd

		return true;
	}



	// TODO: als je userRepo zoekt op id dat niet betsaaat is error 


	

	/*
	TESTING	
	*/

	async createMatches() {
		let name : string = "Marius";
		let id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);

		name = "Justin";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);
		name = "Milan";
		id = await this.userRepo.findOne({
			where: { username: name}
		});
		await this.lookForMatch(id.id);
		name = "Jonathan";
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
	this.randomUser('Marius', 1, '/img/marius.png');
	this.randomUser('Justin', 2, '/img/justin.png');
	this.randomUser('Milan', 3, '/img/milan.png');
	this.randomUser('Jonathan', 4, '/img/jonathan.png');
	this.randomUser('Henk4', 5, "");
	this.randomUser('Henk5', 6, "");
	return 3;
	}

	queuePrint() {
		console.log('\t\t\t USER queue op backend');
		console.log(this.users_looking_for_match);
		console.log('\t\t\t MATCH queue op backend');
		console.log(this.queued_matches);
		return 3;
	}

	async randomUser(name: string, minus: number, avatar: string) {
		const user = await this.userRepo.create();
		user.avatar = avatar;
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


	removeQueue () {
		this.queued_matches.splice(0, this.queued_matches.length);
		this.users_looking_for_match.splice(0, this.users_looking_for_match.length);
		return 3;
	}
}

import { Injectable } from '@nestjs/common';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { UserService } from 'src/user/user.service';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { MatchRepository } from '../match/match.repository';
import { PongService } from '../pong.service';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class QueueService {
	constructor(
		private readonly userService: UserService,
		private readonly matchRepo: MatchRepository,
		private readonly pongService: PongService,
	) {}
	users_looking_for_match: string[] = [];
	queued_matches: QueuedMatch[] = [];
	weWantToRunNewMatch = true;

	private currentMatch;
	async addQueuedMatch(
		player_one_id: string,
		player_two_id: string,
	): Promise<QueuedMatch> {
		const players: User[] = await this.checkPlayers(
			player_one_id,
			player_two_id,
		);

		const new_queued_match = new QueuedMatch();
		new_queued_match.playerOne = players[0];
		new_queued_match.playerTwo = players[1];
		this.queued_matches.push(new_queued_match);

		pubSub.publish('matchFound', { matchFound: new_queued_match });
		this.startNewMatch();
		// if (this.weWantToRunNewMatch) {
		// 	this.startNewMatch();
		// 	this.weWantToRunNewMatch = false;
		// 	console.log('STARTING NEW MATCH');
		// }

		return new_queued_match;
	}
	private async checkPlayers(id1, id2): Promise<User[]> {
		const playerOne = await this.userService.getUserById(id1);
		const playerTwo = await this.userService.getUserById(id2);
		if (!playerOne || !playerTwo)
			throw new Error("One or more users don't exist in the database");
		return [playerOne, playerTwo];
	}

	async joinQueue(player_id: string): Promise<QueuedMatch> | null {
		if (!this.canPlayerLookForMatch(player_id)) return null;

		for (let i = 0; i < this.users_looking_for_match.length; i++) {
			if (this.users_looking_for_match[i] != player_id) {
				const new_queued_match = await this.addQueuedMatch(
					this.users_looking_for_match[i],
					player_id,
				);
				this.users_looking_for_match.splice(i, 1);
				return new_queued_match;
			}
		}
		this.users_looking_for_match.push(player_id);
		return null;
	}

		// TODO: queued_matches public/global maken zodat milan deze functie kan callen en het geen query hoeft te zijn 
		// 	want van backend naar backend
	getQueuedMatch(): QueuedMatch | null {
		const top_match = this.queued_matches.at(0);
		this.queued_matches.splice(0, 1);
		// console.log(top_match);
		return top_match;
	}

	async startNewMatch() {
		const top_match = this.queued_matches.at(0);
		this.queued_matches.splice(0, 1);
		const newMatch = await this.matchRepo.initNewMatch(top_match);
		if (!newMatch) {
			console.log('ERROR: newMatch is null');
			return;
		}
		// if ((await this.isMatchStillRunning()) === false)
		this.currentMatch = this.pongService.startMatch(newMatch);

		// console.log('Started new match: ', newMatch);
	}

	// async isMatchStillRunning(): Promise<boolean> {
	// 	if (!this.currentMatch) {
	// 		return false;
	// 	}

	// 	if (this.currentMatch.isFinished) {
	// 		console.log('Match is no longer running');
	// 		// After waiting for the promise, set it to null, since it is no longer running.
	// 		this.currentMatch = null;
	// 		return false;
	// 	} else {
	// 		console.log('Match is still running');
	// 		return true;
	// 	}
	// }

	getWholeQueue() {
		return this.queued_matches;
	}

	canPlayerLookForMatch(playerId: string): boolean {
		for (let i = 0; i < this.users_looking_for_match.length; i++)
			if (playerId === this.users_looking_for_match[i]) return false;
		for (let i = 0; i < this.queued_matches.length; i++)
			if (
				playerId === this.queued_matches[i].playerOne.id ||
				playerId === this.queued_matches[i].playerTwo.id
			)
				return false;

		// TODO:
		// Voeg check toe waarbij wordt gekeken of player niet al in een match zit
		// of een invite oid heeft verstuurd

		return true;
	}

	/*
	TESTING	
	*/

	async createMatches() {
		this.createMatch('Marius');
		this.createMatch('Justin');
		this.createMatch('Milan');
		this.createMatch('Jonathan');
		// this.createMatch("Henk1");
		// this.createMatch("Henk2");
		// this.createMatch("Henk3");
		// this.createMatch("Henk4");
		// this.createMatch("Marius");
		// this.createMatch("Justin");
		// this.createMatch("Milan");
		// this.createMatch("Jonathan");
		// this.createMatch("Marius");
		// this.createMatch("Justin");
		// this.createMatch("Milan");
		// this.createMatch("Jonathan");
		// this.createMatch("Marius");
		// this.createMatch("Justin");
		// this.createMatch("Milan");
		// this.createMatch("Jonathan");

		return 4;
	}

	private async createMatch(username: string) {
		const name: string = username;
		const user = await this.userService.getUser(name);
		if (user) await this.joinQueue(user.id);
	}

	async fillDbUser() {
		await this.randomUser('Marius');
		await this.randomUser('Justin');
		await this.randomUser('Milan');
		await this.randomUser('Jonathan');
		await this.randomUser('Henk1');
		await this.randomUser('Henk2');
		await this.randomUser('Henk3');
		await this.randomUser('Henk4');
		await this.randomUser('Henk5');
		await this.randomUser('Henk6');
		return 3;
	}

	queuePrint() {
		console.log('\t\t\t USER queue op backend');
		console.log(this.users_looking_for_match);
		console.log('\t\t\t MATCH queue op backend');
		console.log(this.queued_matches);
		return 3;
	}

	async randomUser(name: string) {
		const newUser: CreateUserInput = {
			username: name,
			avatar: 'img/' + name.toLowerCase() + '.png',
			intraId: name + '_intra_id',
		};
		return await this.userService.create(newUser);
	}

	removeQueue() {
		this.queued_matches.splice(0, this.queued_matches.length);
		this.users_looking_for_match.splice(
			0,
			this.users_looking_for_match.length,
		);
		return 3;
	}
}

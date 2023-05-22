import { Injectable } from '@nestjs/common';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { UserService } from 'src/user/user.service';
import { CreateUserInput } from 'src/user/dto/create-user.input';

const DEBUG_PRINT = false;

@Injectable()
export class QueueService {
	constructor(
		private readonly userService: UserService,
	) {}

	users_looking_for_match: string[] = [];
	queued_matches: QueuedMatch[] = [];

	async addQueuedMatch (
		player_one_id: string,
		player_two_id: string,
	) : Promise <QueuedMatch> {

		// TODO: als je userRepo zoekt op id dat niet betsaaat is error 
		const player_one = await this.userService.getUserById(player_one_id);
		const player_two = await this.userService.getUserById(player_two_id);

		const new_queued_match = new QueuedMatch();
		new_queued_match.playerOne = player_one;
		new_queued_match.playerTwo = player_two;
		this.queued_matches.push(new_queued_match);

		pubSub.publish('matchFound', { matchFound: new_queued_match });
		// TODO: call game van milan

		return (new_queued_match);
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
		// console.log(top_match);
		return (top_match);
	}

	getWholeQueue() {
		// console.log (this.queued_matches);
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





	

	/*
	TESTING	
	*/

	async createMatches() {
		this.createMatch("Marius");
		this.createMatch("Justin");
		this.createMatch("Milan");
		this.createMatch("Jonathan");
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

	private async createMatch(username: string){
		let name : string = username;
		let user = await this.userService.getUser(name);
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

	removeQueue () {
		this.queued_matches.splice(0, this.queued_matches.length);
		this.users_looking_for_match.splice(0, this.users_looking_for_match.length);
		return 3;
	}
}

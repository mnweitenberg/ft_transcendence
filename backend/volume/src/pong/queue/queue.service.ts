import { Injectable } from '@nestjs/common';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { UserService } from 'src/user/user.service';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class QueueService {
	constructor(private readonly userService: UserService) {}
	users_looking_for_match: string[] = [];
	queued_matches: QueuedMatch[] = [];

	async addQueuedMatch(
		player_one_id: string,
		player_two_id: string,
	): Promise<QueuedMatch> {
		const players: User[] = await this.checkPlayers(
			player_one_id,
			player_two_id,
		);
		const new_queued_match = new QueuedMatch();
		new_queued_match.p1 = players[0];
		new_queued_match.p2 = players[1];
		this.queued_matches.push(new_queued_match);
		pubSub.publish('queueChanged', { queueChanged: this.queued_matches });
		return new_queued_match;
	}

	private async checkPlayers(id1, id2): Promise<User[]> {
		const p1 = await this.userService.getUserById(id1);
		const p2 = await this.userService.getUserById(id2);
		if (!p1 || !p2)
			throw new Error("One or more users don't exist in the database");
		return [p1, p2];
	}

	async joinQueue(player_id: string): Promise<string> {
		const ret = this.canPlayerLookForMatch(player_id);
		if (ret !== 'yes') return ret;

		for (let i = 0; i < this.users_looking_for_match.length; i++) {
			if (this.users_looking_for_match[i] != player_id) {
				const new_queued_match = await this.addQueuedMatch(
					this.users_looking_for_match[i],
					player_id,
				);
				this.users_looking_for_match.splice(i, 1);
				return 'Match found';
			}
		}
		this.users_looking_for_match.push(player_id);
		return 'Joined the queue';
	}

	getQueuedMatch(): QueuedMatch | null {
		const top_match = this.queued_matches.at(0);
		this.queued_matches.splice(0, 1);
		pubSub.publish('queueChanged', { queueChanged: this.queued_matches });
		return top_match;
	}

	async getWholeQueue(): Promise<QueuedMatch[]> {
		return await this.queued_matches;
	}

	setInitialQueue() {
		pubSub.publish('queueChanged', { queueChanged: this.queued_matches});
		return 3;
	}

	canPlayerLookForMatch(playerId: string): string {
		for (let i = 0; i < this.users_looking_for_match.length; i++) {
			if (playerId === this.users_looking_for_match[i]) {
				return 'You are already in the queue';
			}
		}
		for (let i = 0; i < this.queued_matches.length; i++) {
			if (
				playerId === this.queued_matches[i].p1.id ||
				playerId === this.queued_matches[i].p2.id
			) {
				return 'You are matched with another player';
			}
		}
		return 'yes';
	}

	/*
	TESTING	
	*/
	putInQueue(id: string): number {
		this.users_looking_for_match.push(id);
		return 3;
	}

	async createMatches() {
		this.createMatch('mweitenb');
		this.createMatch('Justin');
		// this.createMatch('Milan');
		this.createMatch('Jonathan');
		this.createMatch('Henk1');
		this.createMatch('Henk2');
		this.createMatch('Henk3');
		this.createMatch('Henk4');
		this.createMatch('Henk5');
		this.createMatch('Henk6');


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

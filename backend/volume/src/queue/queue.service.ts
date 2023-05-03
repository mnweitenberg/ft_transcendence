import { Injectable } from '@nestjs/common';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';

const PRINT = true;

export var queue: Queue[] = [];

@Injectable()
export class QueueService {
	canPlayerLookForMatch(playerId: string): boolean {
		for (let i = 0; i < queue.length; i++)
			if (playerId == queue[i].playerId) return false;

		// TODO
		// Voeg check toe waarbij wordt gekeken of player niet al in een match zit
		// evt wordt dit door front end opgevangen (geen mogelijkheid tot inviten/queue joinen)
		// als je in match zit

		return true;
	}

	findMatch(playername: string): Match {
		const match = new Match();
		for (let i = 0; i < queue.length; i++)
			if (queue[i].playerName != playername) {
				match.matched = true;
				match.playerOneId = playername;
				match.playerTwoId = queue[i].playerName;
				queue.splice(i, 1);
				if (PRINT) {
					console.log('Found match: ', match);
				}
				return match;
			}
		match.matched = false;
		return match;
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
				if (PRINT) {
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
		if (PRINT) {
			console.log('Added to the queue: ', add);
		}
		queue.push(add);
	}

	/*
	DEBUGGING 
	*/
	// printQ(): Queue[] {
	// 	for (let i = 0; i < queue.length; i++) {
	// 		console.log("playerid[%i] = %s", i, queue[i].playerId);
	// 		console.log("playername[%i] = %s", i, queue[i].playerName);
	// 	}
	// 	return queue;
	// }
}

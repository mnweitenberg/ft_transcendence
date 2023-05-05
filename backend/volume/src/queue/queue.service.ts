import { Injectable } from '@nestjs/common';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { GamerScore } from './entities/gamerscore.entity';
import { Repository } from 'typeorm';

const DEBUG_PRINT = true;

export var queue: Queue[] = [];

@Injectable()
export class QueueService {
	constructor(
		@InjectRepository(GamerScore)
		private readonly gamerScoreRepo: Repository<GamerScore>,
	) {}

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
}

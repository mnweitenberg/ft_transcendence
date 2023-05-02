import { Injectable } from '@nestjs/common';
import { Queue } from './queue.model'
import { Match } from './match.model'
import { pubSub } from 'src/app.module';
import { TreeRepositoryUtils } from 'typeorm';

let PRINT = true

export var queue: Queue[] = [] 




function addToQueue(username: String) {
	const add = new Queue;
	add.playerName = username;
	if (PRINT) {
		console.log("Added to the queue: ", PRINT);
	}
	queue.push(add);
}




function findMatch(username: String) : Match {
	const match = new Match;
	for (var i = 0; i < queue.length; i++)
		if (queue[i].playerName != username) {
			match.matched = true;
			match.playerOneId = username;
			match.playerTwoId = queue[i].playerName;
			queue.splice(i, 1);
			if (PRINT) {
				console.log("Found match: ", match);
			}
			return match;
		}
	match.matched = false;
	return match;	
}

function canPlayerLookForMatch(playerId: string) : Boolean {
	for (var i = 0; i < queue.length; i++)
		if (playerId == queue[i].playerId)
			return false;

			// TODO \\
	// Voeg check toe waarbij wordt gekeken of player niet al in een match zit
	// evt wordt dit door front end opgevangen (geen mogelijkheid tot inviten/queue joinen)
	// als je in match zit

	return true;		
}

@Injectable()
export class QueueService {
	
	lookForMatch(playerId: string) : Boolean {
		if (!canPlayerLookForMatch(playerId))
			return false;
	/*
		kijk of speler gematched kan worden
			zo ja dan subscription callen met filter van tegenspeler
			en verwijderen van tegenspeler uit de queue
			evt status aanpassen

			zo nee dan toevoegen aan queue en subscriben op subscribtion met als filter eigen id
			evt status aanpassen
	*/

		return false;
	}
	
	
	
	
	
	
	join(username: String) : Boolean {
		const match = findMatch(username);
		
		if (match.matched) {
			pubSub.publish('filterSub', { filterSub: match} );
		}
		else {
			addToQueue(username);
		}
		return match.matched;
	}
	

	
	/*
	DEBUGGING 
	*/
	printQ(): Queue[] {
		for (let i = 0; i < queue.length; i++)
			console.log("queue[%i].username = %s", i, queue[i].playerNameInQueue);
		return queue;
	}
}

import { Injectable } from '@nestjs/common';
import { Queue, queueStatus } from './queue.model'
import { Match } from './match.model'

export var rij: Queue[] = [] 

function addToQueue(username: String) {
	const add = new Queue;
	add.playerNameInQueue = username;
	add.status = queueStatus.WAITING;
	rij.push(add);
}

function findMatch(username: String) : Match {
	const match = new Match;
	for (var i = 0; i < rij.length; i++)
		if (rij[i].playerNameInQueue != username) {
			match.foundMatch = true;
			match.playerOneName = username;
			match.playerTwoName = rij[i].playerNameInQueue;
			rij.splice(i, 1);
			return match;
		}
	match.foundMatch = false;
	return match;	
}

@Injectable()
export class QueueService {
	join(username: String) : Match {
		const match = findMatch(username);
		
		if (match.foundMatch) {
			
			// call subscription dmv pubsub?
 			// emit data naar front end dmv pubsub?
		}
		else {
			addToQueue(username);
		}
		return match;
	}
	
	
	
	testCreateMatch() : Match {
		let match = new Match;

		match.playerOneName = "111";
		match.playerTwoName = "222";
		match.foundMatch = true;
		return (match);
	}
	
	
	
	
	/*
	DEBUGGING PURPOSES
	*/
	printQ(): Queue[] {
		for (let i = 0; i < rij.length; i++)
			console.log("rij[%i].username = %s", i, rij[i].playerNameInQueue);
		return rij;
	}
}

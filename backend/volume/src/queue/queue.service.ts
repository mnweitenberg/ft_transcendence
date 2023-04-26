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

/*
join que vindt of een match of zet iemand in de que

in geval van match moet subscription event emitten, zodat tegen speler bericht krijgt dat hij gematched is
en rest van mensen de zichtbare queue wordt upgedate met nieuw match

in geval van que alleen bericht terug dat ze in queue zitten (of niks terug sturen)
*/ 

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
	
	
	
	
	
	
	
	
	/*
	DEBUGGING PURPOSES
	*/
	printQ(): Queue[] {
		for (let i = 0; i < rij.length; i++)
			console.log("rij[%i].username = %s", i, rij[i].playerNameInQueue);
		return rij;
	}
}

import { Injectable } from '@nestjs/common';
import { Queue, queueStatus } from './queue.model'
import { Match } from './match.model'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Queue, rij } from './entities/queue.entity';
// import { Socket } from 'socket.io'

// import { CreateUserInput } from './dto/create-user.input';

export var rij: Queue[] = [] 

// const matches: Match[] = [];

function addToQueue(username: String) {
	const add = new Queue;
	add.playerNameInQueue = username;
	add.status = queueStatus.WAITING;
	rij.push(add);
}

function isPlayerInQueue(username: String) {
	for (var i = 0; i < rij.length; i++)
		if (rij[i].playerNameInQueue == username)
			return true;
	return false;		
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
		if (isPlayerInQueue(username)) {
			const placeholder_for_when_frontend_handles_this = new Match;
			console.log("%s is already in queue", username);
			placeholder_for_when_frontend_handles_this.foundMatch = false;
			return placeholder_for_when_frontend_handles_this;
		}
		
		const match = findMatch(username);
		
		if (match.foundMatch) {
			console.log("found match: %s vs %s", match.playerOneName, match.playerTwoName)
		}
		else {
			addToQueue(username);
			match.playerOneName = username;
			console.log("Added to queue: %s", rij[rij.length - 1].playerNameInQueue);
		}
		return match;
	}
	
	
	
	
	
	
	
	
	/*
	DEBUGGING PURPOSES
	*/
	
	// onze front end zou dit moeten opvangen, dus een speler die in queue of in game zit
	// kan nooit joinQueue aanroepen


	printQ(): Queue[] {
		for (let i = 0; i < rij.length; i++)
			console.log("rij[%i].username = %s", i, rij[i].playerNameInQueue);
		return rij;
	}
}

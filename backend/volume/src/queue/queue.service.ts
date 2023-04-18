import { Injectable } from '@nestjs/common';
import { Queue, queueStatus, rij } from './queue.model'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Queue, rij } from './entities/queue.entity';
// import { Socket } from 'socket.io'

// import { CreateUserInput } from './dto/create-user.input';

function addToQueue(username: String) {
	const add = new Queue;
	add.playerNameInQueue = username;
	add.status = queueStatus.WAITING;
	rij.push(add);
	console.log("Added to queue: ", add.playerNameInQueue);
	return add;
}

function isPlayerInQueue(username: String) {
	for (var i = 0; i < rij.length; i++)
		if (rij[i].playerNameInQueue == username)
			return true;
	return false;		
}

@Injectable()
export class QueueService {
	// constructor(
	// 	@InjectRepository(Queue)
	// 	private readonly queueRepository: Repository<Queue>,
	// ) {}

	join(username: String) : Queue {
		if (isPlayerInQueue(username)) {
			console.log(username, " is already in queue");
			return null;
		}
		return addToQueue(username);
	}
}

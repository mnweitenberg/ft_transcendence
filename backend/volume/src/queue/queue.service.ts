import { Injectable } from '@nestjs/common';
import { Queue, rij } from './queue.model'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Queue, rij } from './entities/queue.entity';
// import { Socket } from 'socket.io'

// import { CreateUserInput } from './dto/create-user.input';

function addToQueue(username: String) {
	const add = new Queue;
	add.playerNameInQueue = username;
	rij.push(add);
}

@Injectable()
export class QueueService {
	// constructor(
	// 	@InjectRepository(Queue)
	// 	private readonly queueRepository: Repository<Queue>,
	// ) {}

	create(username: String) : Queue {
		addToQueue(username);
		console.log('added ', rij[0].playerNameInQueue)
		return rij[0];
	}
}

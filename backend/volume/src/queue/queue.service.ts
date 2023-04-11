import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue, rij } from './entities/queue.entity';
import { Socket } from 'socket.io'

// import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class QueueService {
	// constructor(
	// 	@InjectRepository(Queue)
	// 	private readonly queueRepository: Repository<Queue>,
	// ) {}

	clientToUser = {};

	findMatch(userId: string) {
		rij.lookForMatch(userId);

		return "return match if found";
	}

	identify(userId: string, clientId: string) {	
		this.clientToUser[clientId] = userId;		// keeps track of which client is which user (misschien niet nodig?)

	}

	getClientUserId(clientId: string) {
		return this.clientToUser[clientId];
	}
	


	getWholeQueue() {
		let ret: string = rij.queueUserId.join(" + ");

		return ret;
	}

	// async create(playerId: string): Promise<Queue> {
	// 	return this.queueRepository.create({
			// where: { id: playerId } });
		// return await this.queueRepository.save(queue);
	// }
}

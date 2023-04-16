import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue, rij } from './entities/queue.entity';
import { User } from '../user/entities/user.entity'





@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@Query((returns) => [Queue])
	async wholeQueueQuery() {
		return this.queueService.getWholeQueue();
	}

	@Query ((returns) => Queue)
	async joinQueue(userId: User["id"]) {
		var index: number = rij.lookForMatch(userId);
		
		if (index == -1){
			console.log("No match found, return this???");
			return null;
		}
		console.log("Found match on rij[%d]!, return user id??", index);	
		return null
	}


	// @Mutation ()
	// async joinQueue(
	// 	@Args('userid', { type: () => String }) userId: string, 
	// ) {
		
	// }

	@Mutation((returns) => Queue)
	async createQueue(
		@Args('playerId', { type: () => String }) playerId: string, )
		{
        // return this.queueService.create(playerId);

    }
}



// @Resolver()
// export class QueueResolver {
//   @Mutation(() => Queue)
//   async createQueue(): Promise<Queue> {
//     const queueRepository = getRepository(Queue);

//     const queue = new Queue();
//     queue.status = 'waiting'; // Set the initial status to waiting
//     queue.players = 0; // Set the initial number of players to 0
//     queue.maxPlayers = 2; // Set the maximum number of players to 2

//     // Save the new queue to the database
//     await queueRepository.save(queue);

//     return queue;
//   }
// }
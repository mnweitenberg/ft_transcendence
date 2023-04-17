import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { QueueService } from './queue.service';

interface Score {
	playerOne: number;
	playerTwo: number;
}

interface GameScore {
	id: number;
	playerOne: string;
	playerTwo: string;
	score: Score;
}

export const voorbeeldRij: Array<GameScore> = [
	{
		id: 3,
		playerOne: "user",
		playerTwo: "marius",
		score: { playerOne: 0, playerTwo: 0 },
	},
	{
		id: 4,
		playerOne: "jonathan",
		playerTwo: "justin",
		score: { playerOne: 0, playerTwo: 0 },
	},
	{
		id: 5,
		playerOne: "justin",
		playerTwo: "user",
		score: { playerOne: 0, playerTwo: 0 },
	},
	{
		id: 6,
		playerOne: "user",
		playerTwo: "jonathan",
		score: { playerOne: 0, playerTwo: 0 },
	},
];

@WebSocketGateway({
	cors: {
		origin: '*',
	}
})
export class QueueGateway {
	// constructor(private readonly queueService: QueueService) {}
    
	// @SubscribeMessage('test')
	// handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// 	console.log('received test message: ', data);
		
	// 	client.broadcast.emit('message_received', data);
	// }
    // @SubscribeMessage('findMatch')
    // async findMatch(@MessageBody() userId: string) {
    //     // const matches = await this.queueService.findMatch(userId); // should return all matches, including new one
        
    //     console.log("find match called van website!!!!!!");
        
    //     return "hallo van backend";
    //     // this.server.emit('newMatch', matches);      // stuurt naar alle clients de event 'newMatch' met als data alle matches
        
    //     // return matches;     // return to client who called 'joinQueue'
    // }
    
    
    
    // @SubscribeMessage('join')
    // joinQueue(
    //     @MessageBody('UserID') userId: string, 
    //     @ConnectedSocket() client: Socket,      // zorgt ervoor dat de client variable (van type Socket) aangeeft welke client connectie deze function heeft gecalld
    //     ) {
    //         return this.queueService.identify(userId, client.id);
    //     }
        
    //     @SubscribeMessage('findWholeQueue')
    //     findWholeQueue() {
    //         return this.queueService.getWholeQueue();
    //     }
        
    //     // displays 'joining...' if no match is found
    //     @SubscribeMessage('joining')
    //     async joining(
    //         @MessageBody('isJoining') isJoining: boolean,
    //         @ConnectedSocket() client: Socket,
    //     ) {
    //         const userId = await this.queueService.getClientUserId(client.id); // userId should maybe be name
	// 		// dit emit het event 'joining' met de payload 'userId'(string) en 'isJoining'(boolean)
	// 		client.broadcast.emit('joining', { userId, isJoining });     // client.broadcast stuurt naar alle clients behalve current client
	// 	}
}

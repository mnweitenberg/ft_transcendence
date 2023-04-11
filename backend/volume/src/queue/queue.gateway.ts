import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { QueueService } from './queue.service';


//@WebSocketGateway(evtueel PORT_NUMBER)
// Gateways are not instantiated until they are 
// referenced in the providers array of an existing module. 
@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class QueueGateway {

    // WebSocketServer should allow us to send stuff to all clients (dus alle matches als nieuwe match is gevonden)
    @WebSocketServer()
    server: Server;

    constructor(private readonly queueService: QueueService) {}

    @SubscribeMessage('findMatch')
    async findMatch(@MessageBody() userId: string) {
        // const matches = await this.queueService.findMatch(userId); // should return all matches, including new one
        
        console.log("find match called van website!!!!!!");

        return "hallo van backend";
        // this.server.emit('newMatch', matches);      // stuurt naar alle clients de event 'newMatch' met als data alle matches

        // return matches;     // return to client who called 'joinQueue'
    }


    
    @SubscribeMessage('join')
    joinQueue(
        @MessageBody('UserID') userId: string, 
        @ConnectedSocket() client: Socket,      // zorgt ervoor dat de client variable (van type Socket) aangeeft welke client connectie deze function heeft gecalld
        ) {
        return this.queueService.identify(userId, client.id);
    }

    @SubscribeMessage('findWholeQueue')
    findWholeQueue() {
        return this.queueService.getWholeQueue();
    }

    // displays 'joining...' if no match is found
    @SubscribeMessage('joining')
    async joining(
        @MessageBody('isJoining') isJoining: boolean,
        @ConnectedSocket() client: Socket,
        ) {
            const userId = await this.queueService.getClientUserId(client.id); // userId should maybe be name

            // dit emit het event 'joining' met de payload 'userId'(string) en 'isJoining'(boolean)
            client.broadcast.emit('joining', { userId, isJoining });     // client.broadcast stuurt naar alle clients behalve current client
    }


}

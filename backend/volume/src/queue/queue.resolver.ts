import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { Match } from './match.model';
import { pubSub } from 'src/app.module';

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	// When client joins (global) queue
	// userId zou moeten corresponderen met userId in database. Dit zodat er een query kan worden
	// gedaan op de user waardoor de gamerScore data gevuld kan worden.
	// @Mutation((returns) => Boolean)
	@Mutation((returns) => Match, { nullable: true })
	joinQueue(@Args('userId') userId: string) {
		return this.queueService.lookForMatch(userId);
	}

	// 		De filter is afhankelijk van hoe wij de queue inrichten. Onderstaande
	// manier zou geschikt zijn voor een queue-methode waarbij spelers in een global queue
	// komen. Front end zou dan geen queue weergeven en er zouden 'oneindig' veel matches tegelijk
	// kunnen plaatsvinden.
	// 		Filter zou bv ook kunnen op basis van een 'room id' waarbij er tot X aantal matches kunnen
	// queuen in een room. Frontend laat dan gequeude matches zien. Hierbij dus niet oneindig veel matches
	// matches tegelijk.
	@Subscription((returns) => Match, {
		filter: (payload, variable) => {
			return (
				payload.matchFound.playerOneId === variable.user_id ||
				payload.matchFound.playerTwoId === variable.user_id
			);
		},
	})
	matchFound(@Args('user_id') user_id: string) {
		return pubSub.asyncIterator('matchFound');
	}
}

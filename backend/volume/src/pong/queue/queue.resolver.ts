import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { Queue } from './queue.model';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';

@Resolver((of) => Queue)
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation((returns) => String)
	async joinQueue(@AuthUser() user: UserInfo) {
		if (!user) return;
		return this.queueService.joinQueue(user.userUid);
	}

	@Subscription((returns) => [QueuedMatch])
	queueChanged() {
		return pubSub.asyncIterator('queueChanged');
	}

	/*
	TESTING
	*/
	@Query((returns) => Number)
	putInQueue(@Args('id') id: string) {
		return this.queueService.putInQueue(id);
	}

	@Query((returns) => Number)
	createMatches() {
		return this.queueService.createMatches();
	}

	@Query((returns) => Number)
	fillDbUser() {
		return this.queueService.fillDbUser();
	}

	@Query((returns) => Number)
	printQueue() {
		return this.queueService.queuePrint();
	}

	@Query((returns) => Number)
	removeQueue() {
		return this.queueService.removeQueue();
	}
}

import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';

@Resolver()
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => String)
	async joinQueue(@AuthUser() user: UserInfo) {
		if (!user) return;
		return await this.queueService.joinQueue(user.userUid);
	}

	@Subscription(() => [QueuedMatch])
	queueChanged() {
		return pubSub.asyncIterator('queueChanged');
	}

	/*
	TESTING
	*/
	@Query(() => Number)
	putInQueue(@Args('id') id: string) {
		return this.queueService.putInQueue(id);
	}

	@Query(() => Number)
	createMatches() {
		return this.queueService.createMatches();
	}

	@Query(() => Number)
	fillDbUser() {
		return this.queueService.fillDbUser();
	}

	@Query(() => Number)
	printQueue() {
		return this.queueService.queuePrint();
	}

	@Query(() => Number)
	removeQueue() {
		return this.queueService.removeQueue();
	}
}

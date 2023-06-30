import { Args, Mutation, Resolver, Subscription, Query, ObjectType, Field } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
// import { UserInfo } from 'src/auth/auth.service';
import { UserInfo } from 'src/auth/user-info.interface';
import { QueueAvailability } from './queuestatus.model';

@ObjectType()
export class A {
	@Field()
	userId: String;

	@Field()
	state: Boolean;
}

@Resolver()
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@UseGuards(JwtAuthGuard)
	@Query(() => QueueAvailability)
	async canJoinQueue(@AuthUser() user: UserInfo) {
		return await this.queueService.canJoinQueue(user.userUid);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => String)
	async joinQueue(@AuthUser() user: UserInfo) {
		return await this.queueService.joinQueue(user.userUid);
	}

	@Subscription(() => [QueuedMatch])
	queueChanged() {
		return pubSub.asyncIterator('queueChanged');
	}

	@Subscription(() => A, {
		filter: async (payload, variables) => {
			return (
				payload.queueAvailabilityChanged.userId === variables.userId
			);
		},
		// resolve(payload) {
		// 	return payload.state
		// },
	})
	queueAvailabilityChanged(@Args('userId') userId: string) {
		return pubSub.asyncIterator('queueAvailabilityChanged');
	}

	@Query(() => [QueuedMatch])
	getWholeQueue() {
		return this.queueService.getWholeQueue();
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
	addAvatarToUser(@Args('username') username: string) {
		return this.queueService.addAvatarToUser(username);
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

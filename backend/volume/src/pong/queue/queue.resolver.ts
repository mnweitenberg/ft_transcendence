import { Args, Mutation, Resolver, Subscription, Query, ObjectType, Field } from '@nestjs/graphql';
import { QueueService } from './queue.service';
import { pubSub } from 'src/app.module';
import { QueuedMatch } from './queuedmatch.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/user-info.interface';
import { QueueAvailability, ChallengeAvailability } from './queuestatus.model';

@Resolver()
export class QueueResolver {
	constructor(private queueService: QueueService) {}

	@UseGuards(JwtAuthGuard)
	@Query(() => QueueAvailability)
	async getQueueAvailability(@AuthUser() user: UserInfo) {
		return await this.queueService.getQueueAvailability(user.userUid);
	}
	
	@Query(() => ChallengeAvailability)
	async getChallengeAvailability(@Args('friend_id') friend_id: string) {
		return await this.queueService.getChallengeAvailability(friend_id);
	}
	
	@UseGuards(JwtAuthGuard)
	@Query(() => ChallengeAvailability)
	async getOwnChallengeAvailability(@AuthUser() user: UserInfo) {
		return await this.queueService.getChallengeAvailability(user.userUid);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(() => ChallengeAvailability, { nullable: true } )
	async challengeFriend(@AuthUser() user: UserInfo, @Args('friend_id') friend_id: string) {
		return this.queueService.challengeFriend(user.userUid, friend_id);		
	}
	
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Boolean, { nullable: true })
	async joinQueue(@AuthUser() user: UserInfo) {
		return await this.queueService.joinQueue(user.userUid);
	}

	@Subscription(() => [QueuedMatch])
	queueChanged() {
		return pubSub.asyncIterator('queueChanged');
	}

	@Subscription(() => QueueAvailability, {
		filter: async (payload, variables) => {
			return (
				payload.userId === variables.userId
			);
		},
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

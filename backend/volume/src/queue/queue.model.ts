import { Field, ObjectType } from '@nestjs/graphql'

export enum queueStatus {
	IDLE,
	WAITING,
	IN_GAME,
}

@ObjectType()
export class Queue {
	
	
	@Field()
	playerNameInQueue: String;
	
	@Field()
	status: queueStatus;
}
import { Field, ObjectType } from "@nestjs/graphql";

export enum QueueStatus {
	CAN_JOIN,
	IN_MATCH,
	IN_QUEUE 
}

@ObjectType()
export class QueueAvailability {
	@Field()
	queueStatus: QueueStatus;
}

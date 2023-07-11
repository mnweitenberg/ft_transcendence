import { Field, ObjectType } from "@nestjs/graphql";

export enum QueueStatus {
	CAN_JOIN,
	IN_MATCH,
	IN_QUEUE,
	IS_CHALLENGER
}

export enum ChallengeStatus {
	CAN_CHALLENGE,
	IN_MATCH,
	IN_QUEUE,
	IS_CHALLENGER,
	OFFLINE,
}

@ObjectType()
export class Availability {
	@Field()
	queueStatus: QueueStatus;

	@Field()
	challengeStatus: ChallengeStatus; 
}

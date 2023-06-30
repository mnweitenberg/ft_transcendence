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


// export enum TokenType {
// 	FULL = 'FULL',
// 	PARTIAL = 'PARTIAL',
// }

// export interface UserInfo {
// 	intraId: string;
// 	userUid: string;
// 	type: TokenType;
// }


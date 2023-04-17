import { Field, ObjectType } from '@nestjs/graphql'

export enum queueStatus {
	idle,
	waiting,
	in_game,
}

export var rij: Queue[] = [] 

@ObjectType()
export class Queue {

	@Field()
	playerNameInQueue: String;

}
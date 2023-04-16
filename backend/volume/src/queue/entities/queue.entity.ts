import { 
  	Column,
	Entity,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	Index,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { isNullableType } from 'graphql';


export let rij: Queue;

// rij.queueUserId.push("eerste test");
// rij.queueUserId.push("tweede test");
// rij.queueUserId.push("derde test");

@ObjectType()
export class Queue {

	queueUserId: string[];

	// Looks for match in queue, else adds playerId to queue.
 	lookForMatch(userId: string) : number {
		for(var i = 0; i < rij.queueUserId.length; i++)
			if (userId != rij[i].queueUserId)
				return i;
		rij.queueUserId.push(userId);
		return -1;
	}
	
	foundMatch(userOneId: string, index: number) : void {
		let userTwoId : string = rij.queueUserId[index];

		// removes userTwo from queue
		rij.queueUserId.splice(index, 1);

		// 

	}


	@PrimaryGeneratedColumn('uuid')
	@Field()
	id: number;


	// @Column("int")
  	@Field({ nullable: true })
	playerId: string;




	// @Column()
  	@Field()
	availability: string;

	// @Column({ default: 0, type: "int" })
	@Field((type) => Int)
	playersInQueue: number;

	// @Column({ default: false, type: "boolean" })
  	@Field((type) => Boolean)
	is_matched: boolean;
}


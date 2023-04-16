import { 
    Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';



interface Score {
	playerOne: number;
	playerTwo: number;
}

// GameScore == 2 matched players
@ObjectType()
export class GameScore {
	id: number;
	playerOne: string;
	playerTwo: string;
	score: Score;
}

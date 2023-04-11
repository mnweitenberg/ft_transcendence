import { 
    Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Field()
  player_one_id: string;

  @Field()
  player_two_id: string;
}

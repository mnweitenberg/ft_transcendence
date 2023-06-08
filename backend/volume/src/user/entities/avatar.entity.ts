import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Avatar {

  @PrimaryGeneratedColumn({
    name: "avatarId"
  })
  @Field()
  avatarId: number;

  @Column()
  @Field()
  file: string;

  @Column()
  @Field()
  filename: string;
}


import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Avatar {

  @PrimaryGeneratedColumn({
    name: "avatar_id"
  })
  id: number;

  @Column()
  file: string;

  @Column()
  filename: string;
}


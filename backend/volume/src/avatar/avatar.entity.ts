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
  filename: string;

  @Column({ type: "bytea" })
  data: Uint8Array;
}


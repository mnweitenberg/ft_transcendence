import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id: string;

    @Column()
    @Field()
    username: string;

    @Column()
    @Field()
    email: string;

    @Column()
    @Field()
    password: string;

    @Column()
    @Field(type => Int)
    wins: number = 0;

    @Column()
    @Field(type => Int)
    losses: number = 0;
}


// const user = {
//     id: 2,
//     username: "bob"
// }

// const new_user = {
//     ...user,
//     id: 3,
// }
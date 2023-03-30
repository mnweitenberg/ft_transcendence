import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsLatLong } from 'class-validator';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

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
    wins: number;

    @Column()
    @Field(type => Int)
    losses: number;
}


const user = {
    id: 2,
    username: "bob"
}

const new_user = {
    ...user,
    id: 3,
}
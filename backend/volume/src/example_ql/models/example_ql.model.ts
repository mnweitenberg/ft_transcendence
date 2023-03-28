import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExampleQL {
	@Field(type => Int)
	example_field: number;
}

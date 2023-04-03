import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExampleQLService } from './example_ql.service';
import { ExampleQL } from './models/example_ql.model';

@Resolver((of) => ExampleQL)
export class ExampleQLResolver {
	constructor(private exampleQLService: ExampleQLService) {}

	@Query((returns) => ExampleQL)
	async example_query() {
		return this.exampleQLService.get_example();
	}

	@Mutation((returns) => ExampleQL)
	async example_mutation(
		@Args('example_param', { type: () => Int }) example_param: number,
	) {
		return this.exampleQLService.set_example(example_param);
	}
}

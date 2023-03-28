import { Injectable } from '@nestjs/common';
import { ExampleQL } from './models/example_ql.model';

@Injectable()
export class ExampleQLService {
	example: ExampleQL = { example_field: 2 };

	async get_example() {
		return this.example;
	}

	async set_example(value: number) {
		this.example.example_field = value;
		return this.example;
	}
}

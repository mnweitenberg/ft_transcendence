import { Module } from '@nestjs/common';
import { ExampleQLResolver } from './example_ql.resolver';
import { ExampleQLService } from './example_ql.service';

@Module({
	providers: [ExampleQLResolver, ExampleQLService],
})
export class ExampleQLModule {}

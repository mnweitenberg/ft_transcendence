import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { ExampleQLModule } from './example_ql/example_ql.module';

@Module({
	imports: [
		// Here go all the graphql modules that we create
		ExampleQLModule,

		// Use graphql
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: 'schema.gql',
			// sortSchema: true, // Sort lexicographically
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

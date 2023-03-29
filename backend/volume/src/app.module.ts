import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
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
		// Other modules
		ConfigModule.forRoot({
			ignoreEnvFile: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('POSTGRES_DB_HOST'),
				port: +configService.get<number>('POSTGRES_DB_PORT'),
        		username: configService.get('PONG_DB_USER'),
        		password: configService.get('POSTGRES_PASSWORD'),
				database: configService.get('POSTGRES_DB'),
				entities: entities,
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

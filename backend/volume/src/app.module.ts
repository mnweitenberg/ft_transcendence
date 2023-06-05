import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
// import { QueueModule } from './pong/queue/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.service';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { PubSub } from 'graphql-subscriptions';
import { AuthModule } from './auth/auth.module';
import { PongModule } from './pong/pong.module';

export const pubSub = new PubSub();

@Module({
	imports: [
		// Use graphql
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: 'schema.gql',
			context: ({ req, res }) => ({ req, res }),
			subscriptions: {
				'graphql-ws': true,
				'subscriptions-transport-ws': false,
			},
			// sortSchema: true, // Sort lexicographically
		}),
		// Other modules
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AuthModule,
		UserModule,
		// QueueModule,
		LoginModule,
		ChannelModule,
		MessageModule,
		PongModule,
	],
	// controllers: [AppController],
	// providers: [AppService],
})
export class AppModule {}

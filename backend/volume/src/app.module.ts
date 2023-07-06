import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Context } from 'graphql-ws';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.service';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { GroupChatModule } from './chat/group/chat/group_chat.module';
import { GroupMessageModule } from './chat/group/message/group_message.module';
import { PersonalChatModule } from './chat/personal/chat/personal_chat.module';
import { PersonalMessageModule } from './chat/personal/message/personal_message.module';
import { PubSub } from 'graphql-subscriptions';
import { AuthModule } from './auth/auth.module';
import { PongModule } from './pong/pong.module';
import { RankingModule } from './pong/ranking/ranking.module';
import { MatchModule } from './pong/match/match.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import * as cp from 'cookie-parser';

export const pubSub = new PubSub();
const cookieParser = cp();

@Module({
	imports: [
		// Use graphql
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: 'schema.gql',
			context: ({ req, res }) => ({ req, res }),
			// context: async ({ req, res, connection }) => {
			// 	// subscriptions
			// 	if (connection) {
			// 		return { req: connection.context, res };
			// 	}
			// 	// queries and mutations
			// 	return { req, res };
			// },
			subscriptions: {
				'graphql-ws': {
					onConnect: (context: Context<any, any>) => {
						const { connectionParams, extra } = context;
						cookieParser(extra.request, undefined, () => {});
						// user validation will remain the same as in the example above
						// when using with graphql-ws, additional context value should be stored in the extra field
						extra.user = { user: {} };
					},
				},
				'subscriptions-transport-ws': false,
			},
			// sortSchema: true, // Sort lexicographically
			playground: false,
			plugins: [ApolloServerPluginLandingPageLocalDefault()],
		}),
		// Other modules
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AuthModule,
		UserModule,
		LoginModule,
		GroupChatModule,
		GroupMessageModule,
		PersonalChatModule,
		PersonalMessageModule,
		PongModule,
		MatchModule,
		RankingModule,
	],
})
export class AppModule {}

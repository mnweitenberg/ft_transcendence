import { Module } from '@nestjs/common';
import { Match } from './match/entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRepository } from './match/match.repository';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Ranking } from './ranking/entities/ranking.entity';
import { GameLogicService } from './gameLogic.service';
import { PongGateway } from './pong.gateway';
import { QueueService } from './queue/queue.service';
// import { QueueModule } from './queue/queue.module';
import { UserResolver } from 'src/user/user.resolver';
import { QueueResolver } from './queue/queue.resolver';
import { Queue } from './queue/queue.model';

@Module({
	imports: [
		TypeOrmModule.forFeature([Queue, Match, User, Ranking]),
		// QueueModule,
		UserModule,
	],
	providers: [
		MatchRepository,
		GameLogicService,
		QueueResolver,
		QueueService,
		PongGateway,
		UserResolver,
	],
})
export class PongModule {}



// @Module({
// 	imports: [
// 		TypeOrmModule.forFeature([Queue]),
// 		TypeOrmModule.forFeature([Match]),
// 		TypeOrmModule.forFeature([User]),
// 		TypeOrmModule.forFeature([Ranking]),
// 		UserModule,
// 	],
// 	providers: [QueueResolver, QueueService, GameLogicService, MatchRepository],
// 	exports: [QueueService],
// })
// export class QueueModule {}

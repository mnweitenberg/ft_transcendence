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
import { QueueModule } from './queue/queue.module';
import { UserResolver } from 'src/user/user.resolver';
import { AuthService } from 'src/auth/auth.service';
import { PongService } from './pong.service';
import { JwtAuthGuard, WsJwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([Match, User, Ranking]),
		QueueModule,
		UserModule,
	],
	providers: [
		MatchRepository,
		GameLogicService,
		QueueService,
		PongGateway,
		UserResolver,
		AuthService,
		PongService,
		WsJwtGuard,
		JwtAuthGuard,
	],
})
export class PongModule {}

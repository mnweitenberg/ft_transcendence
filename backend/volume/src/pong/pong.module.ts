import { Module } from '@nestjs/common';
import { Match } from './match/entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Ranking } from './ranking/entities/ranking.entity';
import { GameLogicService } from './gameLogic.service';
import { PongGateway } from './pong.gateway';
import { UserResolver } from 'src/user/user.resolver';
import { AuthService } from 'src/auth/auth.service';
import { PongService } from './pong.service';
import { JwtWsGuard } from 'src/auth/guards/jwt-auth.guard';
import { Queue } from './queue/queue.model';
import { MatchModule } from './match/match.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Queue, Match, User, Ranking]),
		UserModule,
		MatchModule,
	],
	providers: [
		GameLogicService,
		PongGateway,
		UserResolver,
		AuthService,
		PongService,
		JwtWsGuard,
	],
})
export class PongModule {}

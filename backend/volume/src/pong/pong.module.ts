import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { Match } from './match/entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRepository } from './match/match.repository';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Ranking } from './ranking/entities/ranking.entity';
import { GameLogicService } from './gameLogic.service';
// import { SocketModule } from './socket.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Match, User, Ranking]),
		UserModule,
		// SocketModule,
	],
	providers: [
		PongService,
		MatchRepository,
		GameLogicService,
		// SocketModule,
	],
})
export class PongModule {}

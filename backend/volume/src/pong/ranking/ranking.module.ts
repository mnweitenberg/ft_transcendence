import { Module } from '@nestjs/common';
import { MatchRepository } from 'src/pong/match/match.repository';
import { PongModule } from 'src/pong/pong.module';
import { UserModule } from 'src/user/user.module';
import { RankingService } from './ranking.service';

@Module({
	imports: [
		// TypeOrmModule.forFeature([Queue, Match, User, Ranking]),
		UserModule,
		PongModule,
	],
	providers: [RankingService],
})
export class RankingModule {}

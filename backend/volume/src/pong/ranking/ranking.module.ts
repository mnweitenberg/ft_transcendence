import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RankingService } from './ranking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Ranking } from './entities/ranking.entity';
import { MatchModule } from '../match/match.module';
import { RankingRepository } from './ranking.repository';
import { RankingResolver } from './ranking.resolver';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Ranking]),
		UserModule,
		MatchModule,
	],
	providers: [RankingService, RankingRepository, RankingResolver],
	exports: [RankingService, RankingRepository],
})
export class RankingModule {}

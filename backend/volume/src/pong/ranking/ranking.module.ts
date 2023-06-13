import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { UserModule } from 'src/user/user.module';
import { MatchModule } from '../match/match.module';
import { RankingService } from './ranking.service';
import { RankingRepository } from './ranking.repository';
import { RankingResolver } from './ranking.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([Ranking]), UserModule, MatchModule],
	providers: [RankingService, RankingRepository, RankingResolver],
	exports: [RankingService, RankingRepository],
})
export class RankingModule {}

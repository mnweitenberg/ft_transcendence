import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UserModule } from 'src/user/user.module';
import { QueueModule } from '../queue/queue.module';
import { MatchService } from './match.service';
import { MatchRepository } from './match.repository';
import { MatchResolver } from './match.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([Match]), UserModule, QueueModule],
	providers: [MatchRepository, MatchService, MatchResolver],
	exports: [MatchRepository, MatchService],
})
export class MatchModule {}

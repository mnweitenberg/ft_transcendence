import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchRepository } from './match.repository';
import { Match } from './entities/match.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { QueueModule } from '../queue/queue.module';

@Module({
	imports: [TypeOrmModule.forFeature([Match]), UserModule, QueueModule],
	providers: [MatchRepository],
	exports: [MatchRepository],
})
export class MatchModule {}

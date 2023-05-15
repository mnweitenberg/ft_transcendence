import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.model';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { Match } from '../match/entities/match.entity';
// import { GameScore, UserGame, Stats, Score } from './entities/gamescore.entity';
import { User } from '../../user/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Queue]),
		TypeOrmModule.forFeature([Match]),
		TypeOrmModule.forFeature([User]),
	],
	providers: [QueueResolver, QueueService],
})
export class QueueModule {}

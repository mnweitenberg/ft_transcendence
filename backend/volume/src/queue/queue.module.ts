import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.model';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { GameScore, UserGame, Stats, Score } from './entities/gamescore.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Queue]),
		TypeOrmModule.forFeature([GameScore]),
		TypeOrmModule.forFeature([UserGame]),
		TypeOrmModule.forFeature([Stats]),
		TypeOrmModule.forFeature([Score]),
	],
	providers: [QueueResolver, QueueService],
})
export class QueueModule {}

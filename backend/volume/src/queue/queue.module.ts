import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.model';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { GamerScore, UserGame, Stats, Score } from './entities/gamerscore.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Queue]),
		TypeOrmModule.forFeature([GamerScore]),
		TypeOrmModule.forFeature([UserGame]),
		TypeOrmModule.forFeature([Stats]),
		TypeOrmModule.forFeature([Score]),
	],
	providers: [QueueResolver, QueueService],
})
export class QueueModule {}

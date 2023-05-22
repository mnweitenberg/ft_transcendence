import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.model';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { Match } from '../match/entities/match.entity';
import { Ranking } from '../../pong/ranking/entities/ranking.entity';
import { User } from '../../user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Queue]),
		TypeOrmModule.forFeature([Match]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Ranking]),
		UserModule,
	],
	providers: [QueueResolver, QueueService],
	exports: [QueueService],
})
export class QueueModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.model';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([Queue])],
	providers: [QueueResolver, QueueService],
})
export class QueueModule {}

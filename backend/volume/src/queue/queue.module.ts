import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './entities/queue.entity';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { QueueGateway } from './queue.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Queue])],
	providers: [QueueResolver, QueueService, QueueGateway],
})
export class QueueModule {}

import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.model';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Queue]), UserModule],
	providers: [QueueService, QueueResolver],
	exports: [QueueService],
})
export class QueueModule {}

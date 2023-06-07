import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueResolver } from './queue.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	providers: [QueueService, QueueResolver],
	exports: [QueueService],
})
export class QueueModule {}

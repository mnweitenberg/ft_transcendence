import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Message]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Channel]),
	],
	providers: [MessageService, MessageResolver, ChannelService, UserService],
})
export class MessageModule {}

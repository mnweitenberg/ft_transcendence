import { Module } from '@nestjs/common';
import { GroupChatService } from './group_chat.service';
import { GroupChatResolver } from './group_chat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './entities/group_chat.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { GroupMessage } from '../message/entities/group_message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([GroupChat]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([GroupMessage]),
	],
	providers: [GroupChatService, GroupChatResolver, UserService],
})
export class GroupChatModule {}

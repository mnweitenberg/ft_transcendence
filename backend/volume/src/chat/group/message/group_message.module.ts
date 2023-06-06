import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './entities/group_message.entity';
import { GroupMessageService } from './group_message.service';
import { GroupMessageResolver } from './group_message.resolver';
import { User } from 'src/user/entities/user.entity';
import { GroupChat } from '../chat/entities/group_chat.entity';
import { GroupChatService } from '../chat/group_chat.service';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([GroupMessage]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([GroupChat]),
	],
	providers: [GroupMessageService, GroupMessageResolver, GroupChatService, UserService],
})
export class GroupMessageModule {}

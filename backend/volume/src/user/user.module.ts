import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Avatar } from './entities/avatar.entity';
import { UserService } from './user.service';
import { UserAvatarService } from './user-avatar.service';
import { UserResolver } from './user.resolver';
import { GroupChat } from 'src/chat/group/chat/entities/group_chat.entity';
import { GroupMessage } from 'src/chat/group/message/entities/group_message.entity';
import { PersonalMessage } from 'src/chat/personal/message/entities/personal_message.entity';
import { PersonalChat } from 'src/chat/personal/chat/entities/personal_chat.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Avatar]),
		TypeOrmModule.forFeature([GroupChat]),
		TypeOrmModule.forFeature([GroupMessage]),
		TypeOrmModule.forFeature([PersonalChat]),
		TypeOrmModule.forFeature([PersonalMessage]),
	],
	providers: [UserResolver, UserService, UserAvatarService],
	exports: [UserService, UserAvatarService],
})
export class UserModule {}

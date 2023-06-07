import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { GroupChat } from 'src/chat/group/chat/entities/group_chat.entity';
import { GroupMessage } from 'src/chat/group/message/entities/group_message.entity';
import { PersonalMessage } from 'src/chat/personal/message/entities/personal_message.entity';
import { PersonalChat } from 'src/chat/personal/chat/entities/personal_chat.entity';
import { Match } from 'src/pong/match/entities/match.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([GroupChat]),
		TypeOrmModule.forFeature([GroupMessage]),
		TypeOrmModule.forFeature([PersonalChat]),
		TypeOrmModule.forFeature([PersonalMessage]),
		TypeOrmModule.forFeature([Match]),
	],
	providers: [UserResolver, UserService],
	exports: [UserService],
})
export class UserModule {}

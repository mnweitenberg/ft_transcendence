import { Module } from '@nestjs/common';
import { PersonalChatService } from './personal_chat.service';
import { PersonalChatResolver } from './personal_chat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalChat } from './entities/personal_chat.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { PersonalMessage } from '../message/entities/personal_message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([PersonalChat]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([PersonalMessage]),
	],
	providers: [PersonalChatService, PersonalChatResolver, UserService],
})
export class PersonalChatModule {}

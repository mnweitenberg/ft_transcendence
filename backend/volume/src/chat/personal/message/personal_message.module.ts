import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalMessage } from './entities/personal_message.entity';
import { PersonalMessageService } from './personal_message.service';
import { PersonalMessageResolver } from './personal_message.resolver';
import { User } from 'src/user/entities/user.entity';
import { PersonalChat } from '../chat/entities/personal_chat.entity';
import { PersonalChatService } from '../chat/personal_chat.service';
import { UserService } from 'src/user/user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([PersonalMessage]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([PersonalChat]),
	],
	providers: [PersonalMessageService, PersonalMessageResolver, PersonalChatService, UserService],
})
export class PersonalMessageModule {}

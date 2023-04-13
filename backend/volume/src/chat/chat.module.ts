import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Chat]), TypeOrmModule.forFeature([User])],
	providers: [ChatService, ChatResolver, UserService]
})
export class ChatModule {}

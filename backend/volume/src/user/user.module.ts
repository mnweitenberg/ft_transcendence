import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Channel } from 'src/channel/entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Avatar]),
		TypeOrmModule.forFeature([Channel]),
		TypeOrmModule.forFeature([Message]),
	],
	providers: [UserResolver, UserService, UserAvatarService],
	exports: [UserService],
})
export class UserModule {}

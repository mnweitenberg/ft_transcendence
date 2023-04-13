import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel]), TypeOrmModule.forFeature([User])],
	providers: [ChannelService, ChannelResolver, UserService]
})
export class ChannelModule {}

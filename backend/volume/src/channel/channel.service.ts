import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateChannelInput } from './dto/create-channel.input';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		private readonly userService: UserService,
	) {}

	async getAllChannels(): Promise<Array<Channel>> {
		return this.channelRepository.find();
	}

	async getChannelById(id: string): Promise<Channel> {
		return this.channelRepository.findOne({ where: { id: id } });
	}

	async create(createChannelInput: CreateChannelInput): Promise<Channel> {
		const members = await Promise.all(
			createChannelInput.member_ids.map((id) =>
				this.userService.getUserById(id),
			),
		);
		const channel = this.channelRepository.create({
			members,
			name: createChannelInput.name,
			logo: createChannelInput.logo,
		});
		return await this.channelRepository.save(channel);
	}

	async getMembers(channel: Channel): Promise<Array<User>> {
		const channel_with_members = await this.channelRepository.findOne({
			relations: { members: true },
			where: { id: channel.id },
		});
		return channel_with_members.members;
	}

	async getMessages(channel: Channel): Promise<Array<Message>> {
		const channel_with_messages = await this.channelRepository.findOne({
			relations: { messages: true },
			where: { id: channel.id },
		});
		return channel_with_messages.messages;
	}
}

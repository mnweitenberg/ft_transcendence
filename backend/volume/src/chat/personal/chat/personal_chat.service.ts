import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalChat } from './entities/personal_chat.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { PersonalMessage } from '../message/entities/personal_message.entity';

@Injectable()
export class PersonalChatService {
	constructor(
		@InjectRepository(PersonalChat)
		private readonly channelRepository: Repository<PersonalChat>,
		private readonly userService: UserService,
	) {}

	async getAllChannels(): Promise<Array<PersonalChat>> {
		return this.channelRepository.find();
	}

	async getChannelById(id: string): Promise<PersonalChat> {
		return this.channelRepository.findOne({ where: { id: id } });
	}

	async create(userId1: string, userId2: string): Promise<PersonalChat> {
		const user1 = await this.userService.getUserById(userId1);
		const user2 = await this.userService.getUserById(userId2);
		const members = [user1, user2];
		const channel = this.channelRepository.create({
			members,
		});
		return await this.channelRepository.save(channel);
	}

	async getMembers(channel: PersonalChat): Promise<Array<User>> {
		const channel_with_members = await this.channelRepository.findOne({
			relations: { members: true },
			where: { id: channel.id },
		});
		return channel_with_members.members;
	}

	async getMessages(channel: PersonalChat): Promise<Array<PersonalMessage>> {
		const channel_with_messages = await this.channelRepository.findOne({
			relations: { messages: true },
			where: { id: channel.id },
		});
		return channel_with_messages.messages;
	}
}

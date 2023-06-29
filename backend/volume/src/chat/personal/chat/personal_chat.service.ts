import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalChat } from './entities/personal_chat.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreatePersonalChatInput } from './dto/create_personal_chat.input';
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

	async create(
		createChannelInput: CreatePersonalChatInput,
	): Promise<PersonalChat> {
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

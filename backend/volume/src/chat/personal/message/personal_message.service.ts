import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { PersonalMessage } from './entities/personal_message.entity';
import { CreatePersonalMessageInput } from './dto/create_personal_message.input';
import { PersonalChatService } from '../chat/personal_chat.service';
import { PersonalChat } from '../chat/entities/personal_chat.entity';

@Injectable()
export class PersonalMessageService {
	constructor(
		@InjectRepository(PersonalMessage)
		private readonly messageRepository: Repository<PersonalMessage>,
		private readonly userService: UserService,
		private readonly channelService: PersonalChatService,
	) {}

	async create(
		createMessageInput: CreatePersonalMessageInput,
		author_id: string,
	): Promise<PersonalMessage> {
		const author = await this.userService.getUserById(author_id);
		const channel = await this.channelService.getChannelById(
			createMessageInput.channel_id,
		);

		console.log(
			'received message: ',
			createMessageInput.content,
			' from ',
			author.username,
			' in channel ',
			channel.id,
		);

		const message = this.messageRepository.create({
			author,
			channel,
			content: createMessageInput.content,
		});
		return await this.messageRepository.save(message);
	}

	async getAuthor(message: PersonalMessage): Promise<User> {
		const message_with_author = await this.messageRepository.findOne({
			relations: { author: true },
			where: { id: message.id },
		});
		return message_with_author.author;
	}

	async getChannel(message: PersonalMessage): Promise<PersonalChat> {
		const message_with_channel = await this.messageRepository.findOne({
			relations: { channel: true },
			where: { id: message.id },
		});
		return message_with_channel.channel;
	}
}

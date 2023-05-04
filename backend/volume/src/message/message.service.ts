import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		private readonly userService: UserService,
		private readonly channelService: ChannelService,
	) {}

	async create(createMessageInput: CreateMessageInput): Promise<Message> {
		const author = await this.userService.getUserById(
			createMessageInput.author_id,
		);
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

	async getAuthor(message: Message): Promise<User> {
		const message_with_author = await this.messageRepository.findOne({
			relations: { author: true },
			where: { id: message.id },
		});
		return message_with_author.author;
	}

	async getChannel(message: Message): Promise<Channel> {
		const message_with_channel = await this.messageRepository.findOne({
			relations: { channel: true },
			where: { id: message.id },
		});
		return message_with_channel.channel;
	}
}

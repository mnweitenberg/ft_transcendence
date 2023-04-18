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
		const sender = await this.userService.getUserById(
			createMessageInput.sender_id,
		);
		const channel = await this.channelService.getChannelById(
			createMessageInput.channel_id,
		);

		console.log(
			'received message: ',
			createMessageInput.content,
			' from ',
			sender.username,
			' in channel ',
			channel.id,
		);

		const message = this.messageRepository.create({
			sender,
			channel,
			content: createMessageInput.content,
		});
		return await this.messageRepository.save(message);
	}

	async getSender(message: Message): Promise<User> {
		const message_with_sender = await this.messageRepository.findOne({
			relations: { sender: true },
			where: { id: message.id },
		});
		return message_with_sender.sender;
	}

	async getChannel(message: Message): Promise<Channel> {
		const message_with_channel = await this.messageRepository.findOne({
			relations: { channel: true },
			where: { id: message.id },
		});
		return message_with_channel.channel;
	}
}

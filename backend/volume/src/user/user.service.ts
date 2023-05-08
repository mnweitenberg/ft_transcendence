import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Channel } from 'src/channel/entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getAllUsers(): Promise<Array<User>> {
		return this.userRepository.find();
	}

	async getUser(usernameParam: string) {
		return this.userRepository.findOne({
			where: { username: usernameParam },
		});
	}

	async getUserById(id: string) {
		return this.userRepository.findOne({
			where: { id: id },
		});
	}

	async getUserByIntra(intraId: string) {
		return this.userRepository.findOne({
			where: { intraId: intraId },
		});
	}

	async create(createUserInput: CreateUserInput): Promise<User> {
		const user = this.userRepository.create(createUserInput);
		return await this.userRepository.save(user);
	}

	async getChannels(user: User): Promise<Array<Channel>> {
		const user_with_channels = await this.userRepository.findOne({
			relations: { channels: true },
			where: { id: user.id },
		});
		return user_with_channels.channels;
	}

	async getMessages(user: User): Promise<Array<Message>> {
		const user_with_messages = await this.userRepository.findOne({
			relations: { messages: true },
			where: { id: user.id },
		});
		return user_with_messages.messages;
	}
}

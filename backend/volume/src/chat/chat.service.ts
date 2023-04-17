import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateChatInput } from './dto/create-chat.input';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
		private readonly userService: UserService,
	) {}

	async getAllChats(): Promise<Array<Chat>> {
		return this.chatRepository.find();
	}

	async create(createChatInput: CreateChatInput): Promise<Chat> {
		const members = await Promise.all(createChatInput.member_ids.map((id) => this.userService.getUserById(id)));
		const chat = this.chatRepository.create({
			members,
		});
		return await this.chatRepository.save(chat);
	}

	async getMembers(chat: Chat): Promise<Array<User>> {
		const chat_ = await this.chatRepository.findOne({ relations: { members: true }, where: { id: chat.id } });
		return chat_.members;
	}
}

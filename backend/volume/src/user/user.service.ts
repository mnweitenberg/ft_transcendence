import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Chat } from 'src/chat/entities/chat.entity';

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

	async create(createUserInput: CreateUserInput): Promise<User> {
		const user = this.userRepository.create(createUserInput);
		return await this.userRepository.save(user);
	}

	async getChats(user: User): Promise<Array<Chat>> {
		const user_ = await this.userRepository.findOne({ relations: { chats: true }, where: { id: user.id } });
		return user_.chats;
	}
}

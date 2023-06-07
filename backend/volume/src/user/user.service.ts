import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { GroupChat } from 'src/chat/group/chat/entities/group_chat.entity';
import { PersonalChat } from 'src/chat/personal/chat/entities/personal_chat.entity';

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

	async getUserByIntraId(intraId: string) {
		return this.userRepository.findOne({
			where: { intraId: intraId },
		});
	}

	async create(createUserInput: CreateUserInput): Promise<User> {
		const user = this.userRepository.create(createUserInput);
		user.avatar = ''; // FIXME: temp fix, untill avatar is default set
		return await this.userRepository.save(user);
	}

	async getGroupChats(user: User): Promise<Array<GroupChat>> {
		const user_with_channels = await this.userRepository.findOne({
			relations: { group_chats: true },
			where: { id: user.id },
		});
		return user_with_channels.group_chats;
	}

	async getPersonalChats(user: User): Promise<Array<PersonalChat>> {
		const user_with_channels = await this.userRepository.findOne({
			relations: { personal_chats: true },
			where: { id: user.id },
		});
		return user_with_channels.personal_chats;
	}

	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}
}

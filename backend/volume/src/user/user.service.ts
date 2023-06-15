import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { GroupChat } from 'src/chat/group/chat/entities/group_chat.entity';
import { PersonalChat } from 'src/chat/personal/chat/entities/personal_chat.entity';
import { Match } from 'src/pong/match/entities/match.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getAllUsers(): Promise<Array<User>> {
		return this.userRepository.find();
	}

	async getUser(usernameParam: string): Promise<User> {
		return this.userRepository.findOne({
			where: { username: usernameParam },
		});
	}

	async getUserById(id: string, relations = {}) {
		return this.userRepository.findOne({
			relations,
			where: { id: id },
		});
	}

	async getUserByIntraId(intraId: string, relations = {}) {
		return this.userRepository.findOne({
			relations,
			where: { intraId: intraId },
		});
	}

	async create(createUserInput: CreateUserInput): Promise<User> {
		const user = this.userRepository.create(createUserInput);
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

	async getMatchHistory(user: User): Promise<Array<Match>> {
		const userMatchHistory = await this.userRepository.findOne({
			relations: ['match_history', 'match_history.players'],
			where: { id: user.id },
		});
		return userMatchHistory.match_history;
	}

	// async getMatchHistory(user: User): Promise<Array<Match>> {
	// 	const userMatchHistory = await this.userRepository.find({
	// 		join: {
	// 			alias: 'user',
	// 			leftJoinAndSelect: {
	// 				match_history: 'user.match_history',
	// 				players: 'match_history.players',
	// 			},
	// 		},
	// 		where: { id: user.id },
	// 	});

	// 	if (userMatchHistory.length > 0)
	// 		return userMatchHistory[0].match_history;
	// 	return [];
// }

	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	async acceptFriend(user_uid: string, friend_id: string) {
		const user = await this.userRepository.findOne({
			relations: { friend: true, friends: true },
			where: { id: user_uid },
		});
		const friend = await this.userRepository.findOne({
			relations: { friend: true, friends: true },
			where : { id: friend_id },
		});
		friend.friend.push(user);
		user.friend.push(friend);

		this.userRepository.save(user);
		this.userRepository.save(friend);

		return true;
	}
	
	async removeFriend(user_uid: string, friend_id: string) {
		const user = await this.userRepository.findOne({
			relations: { friend : true },
			where: { id: user_uid },
		});
		for (let i = 0; user.friend[i]; i++){
			if (user.friend[i].id === friend_id ) {

			}
		}
		return true;
	}

	async getFriends(user_uid: string) : Promise <User[]> {
		const user = await this.userRepository.findOne({
			relations: { friend : true },
			where: { id: user_uid },
		});
		return user.friend;
	}

}

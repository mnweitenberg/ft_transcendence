import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { GroupChat } from 'src/chat/group/chat/entities/group_chat.entity';
import { PersonalChat } from 'src/chat/personal/chat/entities/personal_chat.entity';
import { Match } from 'src/pong/match/entities/match.entity';
import { IncomingMessage } from 'http';
import { pubSub } from 'src/app.module';

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

	// TODO:
	// deny friend request()
	// 	- remove req from outgoing incoming request in db
	//		X user needs to remove incoming
	//		friend needs to remove outgoing			
	// 	- subscription call friendRequestChange for friend
	//	- mutation returns new user info to user
	async denyFriend(user_id: string, friend_id: string) {
		const user = await this.userRepository.findOne({
			relations: { incoming_friend_requests: true },
			where: { id: user_id },
		});
		for (let i = 0; i < user.incoming_friend_requests.length; i++) {
			if (user.incoming_friend_requests[i].id === friend_id) {
				user.incoming_friend_requests.splice(i, 1);
				break;	
			}
		}
		const friend = await this.userRepository.findOne({
				relations: { outgoing_friend_requests: true },
				where : { id: friend_id },
			});
		for (let i = 0; i < friend.outgoing_friend_requests.length; i++) {
			if (friend.outgoing_friend_requests[i].id === user_id) {
					friend.outgoing_friend_requests.splice(i, 1);
					break;
			}
		}
		await this.userRepository.save([ user, friend ]);
		pubSub.publish('friend_request_changed', { friend_request_changed: friend });
		return user;
	}


	// TODO: tests all friend functions for empty friend lists
	async acceptFriend(user_id: string, friend_id: string) {
		const user = await this.userRepository.findOne({
			relations: { friends: true },
			where: { id: user_id },
		});
		const friend = await this.userRepository.findOne({
			relations: { friends: true },
			where : { id: friend_id },
		});
		for (let i = 0; i < user.friends.length; i++) {
			if (user.friends[i].username === friend.username) {
				return false;
			}
		}
		friend.friends.push(user);
		user.friends.push(friend);

		await this.userRepository.save([ user, friend ]);

		return true;
	}
	
	async removeFriend(user_id: string, friend_id: string) {
		const user = await this.userRepository.findOne({
			relations: { friends : true },
			where: { id: user_id },
		});
		for (let i = 0; i < user.friends.length; i++){
			if (user.friends[i].id === friend_id ) {
				user.friends.splice(i, 1);
			}
		}
		const friend = await this.userRepository.findOne({
			relations: { friends : true },
			where: { id: friend_id },
		});
		for (let i = 0; i < friend.friends.length; i++){
			if (friend.friends[i].id === user_id ) {
				friend.friends.splice(i, 1);
			}
		}
		await this.userRepository.save([user, friend]);
		return true;
	}

	async getFriends(user_id: string) : Promise <User[]> {
		const user = await this.userRepository.findOne({
			relations: { friends : true },
			where: { id: user_id },
		});
		return user.friends;
	}

	async inviteFriend(user_id: string, friend_id: string) {
		const user = await this.userRepository.findOne({
			relations: { friends : true, outgoing_friend_requests : true,  },
			where: { id: user_id },
		});
		const friend = await this.userRepository.findOne({
			relations: { friends : true, incoming_friend_requests : true },
			where: { id: friend_id },
		});
		user.outgoing_friend_requests.push(friend);
		friend.incoming_friend_requests.push(user);
		this.userRepository.save(friend);
		this.userRepository.save(user);

		return true;
	}

	async getOutgoingFriendRequest(user_id: string) : Promise <User[]> {
		const user = await this.userRepository.findOne({
			relations: { outgoing_friend_requests : true },
			where: { id: user_id },
		});
		return user.outgoing_friend_requests;
	}
	
	async getIncomingFriendRequest(user_id: string) : Promise <User[]> {
		const user = await this.userRepository.findOne({
			relations: { incoming_friend_requests : true },
			where: { id: user_id },
		});
		return user.incoming_friend_requests;
	}



	// TESTING

	/*
	 	To create some friends in 3 easy steps:
			1. go to backend/graphql
			2. query { fillDbUser }
			3. query { createFriends (user_name: "your_user_name") }	eg. 'jhille' if you're Justin
	 */
	async createFriends (user_name: string) : Promise<Number> {
		const user = await this.userRepository.findOne({
			where: { username: user_name },
		});
		const friend = await this.userRepository.findOne({
			where : { username: 'Marius' },
		});
		const friend1 = await this.userRepository.findOne({
			where : { username: 'Milan' },
		});
		const friend2 = await this.userRepository.findOne({
			where : { username: 'Justin' },
		});
		const friend3 = await this.userRepository.findOne({
			where : { username: 'Henk4' },
		});
		const friend4 = await this.userRepository.findOne({
			where : { username: 'Henk1' },
		});
		const friend5 = await this.userRepository.findOne({
			where : { username: 'Henk2' },
		});
		const friend6 = await this.userRepository.findOne({
			where : { username: 'Henk3' },
		});
		
		await this.acceptFriend(user.id, friend.id);
		await this.acceptFriend(user.id, friend1.id);
		await this.acceptFriend(user.id, friend2.id);
		await this.acceptFriend(user.id, friend3.id);
		await this.acceptFriend(user.id, friend4.id);
		await this.acceptFriend(user.id, friend5.id);
		await this.acceptFriend(user.id, friend6.id);

		return 3;
	}

}

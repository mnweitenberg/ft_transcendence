import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Avatar } from './entities/avatar.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';
import { UserAvatarService } from './user-avatar.service';
import { ChangeUserDataInput } from './dto/change-user-data-input';
import { UploadAvatarInput } from './dto/upload-avatar.input';

@Resolver(() => User)
export class UserResolver {
	constructor(
		private userService: UserService,
		private userAvatarService: UserAvatarService
	) {}

	@Query(() => [User])
	async allUsersQuery() {
		return this.userService.getAllUsers();
	}

	@Query(() => User, { name: 'user'})
	async userQuery(
		@Args('username', { type: () => String }) usernameParam: string,
	) {
		const user = await this.userService.getUser(usernameParam);
		if (user) return user;
		return null;
	}

	@UseGuards(JwtAuthGuard)
	@Query(() => User)
	async currentUserQuery(@AuthUser() user: UserInfo) {
		return this.userService.getUserById(user.userUid);
	}

	@Query(() => User)
	async queryUserByName(
		@Args('username', { type: () => String }) username: string,
	) {
		const user = await this.userService.getUser(username);
		if (!user) throw new Error('User not found');
		return user;
	}

	@Mutation(() => User)
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
	) {
		return this.userService.create(createUserInput);
	}

	@UseGuards(JwtAuthGuard)
	@Mutation(returns => User)
	async changeUserData(
		@AuthUser() userInfo: UserInfo,
		@Args('changeUserData') changeUserData: ChangeUserDataInput
	) {
		const user = await this.userService.getUserById(userInfo.userUid);
		if (changeUserData.avatar) {
			changeUserData.avatar.parentUserUid = userInfo.userUid;
			user.avatar = await this.userAvatarService.createOrUpdate(changeUserData.avatar);
		}
		user.username = changeUserData.username;
		await this.userService.save(user);
		return await this.userService.getUserById(userInfo.userUid);
	}

	@ResolveField('avatar', returns => Avatar)
	async getAvatar(@Parent() user: User) {
		return this.userAvatarService.getAvatar(user.id);
	}

	@ResolveField()
	async group_chats(@Parent() user: User) {
		return this.userService.getGroupChats(user);
	}

	@ResolveField()
	async personal_chats(@Parent() user: User) {
		return this.userService.getPersonalChats(user);
	}
}

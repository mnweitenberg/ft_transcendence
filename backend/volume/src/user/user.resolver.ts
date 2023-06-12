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
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { UserInfo } from 'src/auth/auth.service';

@Resolver(() => User)
export class UserResolver {
	constructor(private userService: UserService) {}

	@Query(() => [User])
	async allUsersQuery() {
		return this.userService.getAllUsers();
	}

	@Query(() => User)
	async userQuery(
		@Args('username', { type: () => String }) usernameParam: string,
	) {
		return this.userService.getUser(usernameParam);
	}

	@UseGuards(JwtAuthGuard)
	@Query(() => User)
	async currentUserQuery(@AuthUser() user: UserInfo) {
		if (!user) return;
		return this.userService.getUserByIntraId(user.intraId);
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

	@ResolveField()
	async group_chats(@Parent() user: User) {
		return this.userService.getGroupChats(user);
	}

	@ResolveField()
	async personal_chats(@Parent() user: User) {
		return this.userService.getPersonalChats(user);
	}
}

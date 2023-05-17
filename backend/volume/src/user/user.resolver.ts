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

@Resolver((of) => User)
export class UserResolver {
	constructor(private userService: UserService) {}

	@Query((returns) => [User])
	async allUsersQuery() {
		return this.userService.getAllUsers();
	}

	@Query((returns) => User)
	async userQuery(
		@Args('username', { type: () => String }) usernameParam: string,
	) {
		return this.userService.getUser(usernameParam);
	}

	@UseGuards(JwtAuthGuard)
	@Query((returns) => User)
	async currentUserQuery(@AuthUser() user: UserInfo) {
		return this.userService.getUserByIntraId(user.intraId);
	}

	@Mutation((returns) => User)
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
	) {
		return this.userService.create(createUserInput);
	}

	@ResolveField()
	async channels(@Parent() user: User) {
		return this.userService.getChannels(user);
	}

	@ResolveField()
	async messages(@Parent() user: User) {
		return this.userService.getMessages(user);
	}
}

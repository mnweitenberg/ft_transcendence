import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(of => User)
export class UserResolver {
    constructor (
        private userService: UserService,
    ) {}

    @Query(returns => [User])
    async usersQuery() {
        return this.userService.getAllUsers();
    }

    // @Mutation(returns => User)
    // async userMutation(@Args('new_username', { type: () => String}) usernameParam: string) {
    //     return this.userService.setUsername(usernameParam);
    // }
}

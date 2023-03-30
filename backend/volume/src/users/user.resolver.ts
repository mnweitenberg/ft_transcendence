import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(of => User)
export class UserResolver {
    constructor (
        private userService: UserService,
    ) {}

    @Query(returns => User)
    async userQuery() {
        return this.userService.getUser();
    }

    @Mutation(returns => User)
    async userMutation(@Args('new_username', { type: () => Int}) usernameParam: number) {
        return this.userService.setUsername(usernameParam);
    }
}

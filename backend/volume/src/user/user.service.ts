import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";

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
            where: { username: usernameParam, },
        })
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const user = this.userRepository.create(createUserInput);
        return await this.userRepository.save(user);
    }
}

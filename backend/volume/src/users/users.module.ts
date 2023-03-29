import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([User])],],
})
export class UsersModule {}
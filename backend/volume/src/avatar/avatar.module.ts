import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Avatar } from "./avatar.entity";
import { AvatarResolver } from "./avatar.resolver";
import { AvatarService } from "./avatar.service";

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  providers: [AvatarResolver, AvatarService],
})
export class AvatarModule {}

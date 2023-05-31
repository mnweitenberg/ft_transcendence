import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Avatar } from "./avatar.entity";
import { UploadAvatarInput } from "./dto/upload-avatar.input";
import { AvatarService } from "./avatar.service";

@Resolver((of) => Avatar)
export class AvatarResolver {
  constructor(private avatarService: AvatarService) {}

  @Mutation((returns) => Avatar)
  async uploadAvatar(@Args('uploadAvatarInput') uploadAvatarInput: UploadAvatarInput)
  {
    return this.avatarService.create(uploadAvatarInput);
  }
}

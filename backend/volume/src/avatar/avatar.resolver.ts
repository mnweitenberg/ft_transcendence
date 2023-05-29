import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AvatarService } from "./avatar.service";
import { GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Resolver((of) => Avatar)
export class AvatarResolver {
  constructor(private avatarService: AvatarService) {}

  @Mutation((returns) => Avatar)
  async createAvatar(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload)
  {
    let readStream = file.createReadStream()
    let data = ''
    readStream.once('error', err => {
      return console.log(err)
    })
    readStream.on('data', chunk => (data += chunk))
    readStream.on('end', () => {
  this.userService.createUser(email, age, Buffer.from(data, 'binary'))
})
  }
}

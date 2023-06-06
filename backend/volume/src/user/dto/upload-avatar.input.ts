import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UploadAvatarInput {
  @Field()
  file: string;

  @Field()
  filename: string;
}

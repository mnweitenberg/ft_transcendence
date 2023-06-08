import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Avatar } from "./entities/avatar.entity";
import { UploadAvatarInput } from "./dto/upload-avatar.input";

@Injectable()
export class UserAvatarService {
	constructor(
		@InjectRepository(Avatar)
		private readonly avatarRepository: Repository<Avatar>,
	) {}

	async create(userUid: string, uploadAvatarInput: UploadAvatarInput)
	{
		const avatar = this.avatarRepository.create(uploadAvatarInput);
		return this.avatarRepository.save(avatar);
	}

	async getAvatar(avatarIdParam: number) {
		return this.avatarRepository.findOne({
			where: { avatarId: avatarIdParam },
		});
	}
}

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

	async create(uploadAvatarInput: UploadAvatarInput)
	{
		const avatar = this.avatarRepository.create(uploadAvatarInput);
		return this.avatarRepository.save(avatar);
	}

	async createOrUpdate(uploadAvatarInput: UploadAvatarInput) {
		return this.avatarRepository.save(uploadAvatarInput); 
		// if (userUid) {
		// 	return this.avatarRepository.update(userUid, uploadAvatarInput);
		// }
		// else {
		// 	return this.create(uploadAvatarInput);
		// }
	}

	async getAvatar(userUid: string) {
		return this.avatarRepository.findOne({
			where: { parentUserUid: userUid },
		});
	}
}

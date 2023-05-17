import { User } from '../../../user/entities/user.entity';

export class GameScoreDto {
	playerOne: User;
	playerOneScore: number;
	playerTwo: User;
	playerTwoScore: number;
}

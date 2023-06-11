import { Injectable } from '@nestjs/common';
import { MatchRepository } from 'src/pong/match/match.repository';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Match } from 'src/pong/match/entities/match.entity';
import { pubSub } from 'src/app.module';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

interface GameScore {
	id: string;
	p1: string;
	p1Avatar: string,
	p1Score: number;
	p2: string;
	p2Avatar: string,
	p2Score: number;
}

@Injectable()
export class MatchService {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly userService: UserService,
	) {
		// this.updateMatchHistory();
	}

	// @UseGuards(JwtAuthGuard)
	async updateMatchHistory() {
		console.log('UPDATE MATCH HISTORY');
		const matches = await this.matchRepo.findAll();
		pubSub.publish('matchHistoryHasBeenUpdated', { matchHistoryHasBeenUpdated: matches });
	}

}

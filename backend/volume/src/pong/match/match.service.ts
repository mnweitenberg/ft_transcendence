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
		// console.log (user);
		const matchHistory = await this.matchRepo.findAll();
		// const matchHistory = await this.userService.getMatchHistory(user);
		// console.log('matchHistory', matchHistory);
		let cleanHistory: GameScore[] = [];
		for (const match of matchHistory) {
			// console.log('match', match);
			const [p1, p2] = await this.matchRepo.getPlayersInMatch(match);
			if (!p1 || !p2) continue;
			// console.log('players', p1.username, p2.username);
			cleanHistory.push({
				id: match.id,
				p1: p1.username,
				p1Avatar: p1.avatar,
				p1Score: match.p1Score,
				p2: p2.username,
				p2Avatar: p2.avatar,
				p2Score: match.p2Score,
			});
		}
		// console.log('cleanHistory', cleanHistory);
		pubSub.publish('matchHistoryHasBeenUpdated', { matchHistoryHasBeenUpdated: cleanHistory, });
	}
}

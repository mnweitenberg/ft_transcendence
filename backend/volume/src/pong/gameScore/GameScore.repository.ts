import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './entities/gamescore.entity';

@Injectable()
export class GameScoreRepository {
  constructor(
    @InjectRepository(Score)
    private readonly gameScoreRepository: Repository<Score>,
  ) {}

  public async findAllGameScores(): Promise<Score[]> {
    return this.gameScoreRepository.find();
  }

  // public async findGameScoreById(id: string): Promise<GameScore> {
  //   return this.gameScoreRepository.findOne(id);
  // }

  public async saveGameScore(gameScore: Score): Promise<Score> {
    return this.gameScoreRepository.save(gameScore);
  }
}

import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Ranking} from '../domain/model/ranking.entity';
import {Leaderboard} from '../domain/model/leaderboard.entity';
import {UserScore} from '../domain/model/user-score.entity';
import {HttpClient} from '@angular/common/http';
import {RankingApiEndpoint} from './ranking-api-endpoint';
import {LeaderboardApiEndpoint} from './leaderboard-api-endpoint';
import {UserScoreApiEndpoint} from './user-score-api-endpoint';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingApi extends BaseApi {
  private readonly rankingsEndpoint: RankingApiEndpoint;
  private readonly leaderboardsEndpoint: LeaderboardApiEndpoint;
  private readonly userScoresEndpoint: UserScoreApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.rankingsEndpoint = new RankingApiEndpoint(http);
    this.leaderboardsEndpoint = new LeaderboardApiEndpoint(http);
    this.userScoresEndpoint = new UserScoreApiEndpoint(http);
  }

  // Ranking methods
  getRankings(): Observable<Ranking[]> {
    return this.rankingsEndpoint.getAll();
  }

  getRanking(id: number): Observable<Ranking> {
    return this.rankingsEndpoint.getById(id);
  }

  createRanking(ranking: Ranking): Observable<Ranking> {
    return this.rankingsEndpoint.create(ranking);
  }

  updateRanking(ranking: Ranking): Observable<Ranking> {
    return this.rankingsEndpoint.update(ranking, ranking.id);
  }

  deleteRanking(id: number): Observable<void> {
    return this.rankingsEndpoint.delete(id);
  }

  // Leaderboard methods
  getLeaderboards(): Observable<Leaderboard[]> {
    return this.leaderboardsEndpoint.getAll();
  }

  getLeaderboard(id: number): Observable<Leaderboard> {
    return this.leaderboardsEndpoint.getById(id);
  }

  createLeaderboard(leaderboard: Leaderboard): Observable<Leaderboard> {
    return this.leaderboardsEndpoint.create(leaderboard);
  }

  updateLeaderboard(leaderboard: Leaderboard): Observable<Leaderboard> {
    return this.leaderboardsEndpoint.update(leaderboard, leaderboard.id);
  }

  deleteLeaderboard(id: number): Observable<void> {
    return this.leaderboardsEndpoint.delete(id);
  }

  // UserScore methods
  getUserScores(): Observable<UserScore[]> {
    return this.userScoresEndpoint.getAll();
  }

  getUserScore(id: number): Observable<UserScore> {
    return this.userScoresEndpoint.getById(id);
  }

  createUserScore(userScore: UserScore): Observable<UserScore> {
    return this.userScoresEndpoint.create(userScore);
  }

  updateUserScore(userScore: UserScore): Observable<UserScore> {
    return this.userScoresEndpoint.update(userScore, userScore.id);
  }

  deleteUserScore(id: number): Observable<void> {
    return this.userScoresEndpoint.delete(id);
  }
}

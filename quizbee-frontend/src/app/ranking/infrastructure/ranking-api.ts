import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Ranking } from '../domain/model/ranking.entity';
import { RankingApiEndpoint } from './ranking-api-endpoint';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingApi extends BaseApi {
  private readonly rankingEndpoint: RankingApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.rankingEndpoint = new RankingApiEndpoint(http);
  }

  /**
   * Gets global ranking
   */
  getGlobalRanking(page: number = 1, limit: number = 50): Observable<Ranking[]> {
    return this.rankingEndpoint.getGlobalRanking(page, limit);
  }

  /**
   * Gets ranking by level
   */
  getRankingByLevel(level: string, page: number = 1, limit: number = 50): Observable<Ranking[]> {
    return this.rankingEndpoint.getRankingByLevel(level, page, limit);
  }

  /**
   * Gets ranking by country
   */
  getRankingByCountry(country: string, page: number = 1, limit: number = 50): Observable<Ranking[]> {
    return this.rankingEndpoint.getRankingByCountry(country, page, limit);
  }

  /**
   * Gets user's current ranking
   */
  getUserRanking(userId: number): Observable<Ranking> {
    return this.rankingEndpoint.getUserRanking(userId);
  }

  /**
   * Updates user ranking after quiz completion
   */
  updateUserRanking(userId: number, score: number): Observable<Ranking> {
    // This would typically be called by the backend automatically after quiz completion
    // For now, we'll implement it as a separate method
    const updateData = { userId, score };
    return this.rankingEndpoint.update({} as Ranking, userId); // Simplified for example
  }
}

import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Ranking} from '../domain/model/ranking.entity';
import {HttpClient} from '@angular/common/http';
import {RankingApiEndpoint} from './ranking-api-endpoint';
import {Observable} from 'rxjs';

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
   * Retrieves global rankings
   */
  getGlobalRankings(): Observable<Ranking[]> {
    return this.rankingEndpoint.getGlobalRankings();
  }

  /**
   * Retrieves rankings by level
   */
  getRankingsByLevel(level: string): Observable<Ranking[]> {
    return this.rankingEndpoint.getRankingsByLevel(level);
  }

  /**
   * Retrieves rankings by country
   */
  getRankingsByCountry(country: string): Observable<Ranking[]> {
    return this.rankingEndpoint.getRankingsByCountry(country);
  }

  /**
   * Retrieves user ranking
   */
  getUserRanking(userId: number): Observable<Ranking> {
    return this.rankingEndpoint.getUserRanking(userId);
  }

  /**
   * Retrieves rankings with pagination
   */
  getRankings(limit: number = 50, offset: number = 0): Observable<Ranking[]> {
    // Implementation for paginated rankings
    return this.rankingEndpoint.getAll();
  }
}

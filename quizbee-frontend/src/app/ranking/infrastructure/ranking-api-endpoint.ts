import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Ranking } from '../domain/model/ranking.entity';
import { RankingResource, RankingResponse } from './ranking-response';
import { RankingAssembler } from './ranking-assembler';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class RankingApiEndpoint extends BaseApiEndpoint<Ranking, RankingResource, RankingResponse, RankingAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}/ranking`,
      new RankingAssembler()
    );
  }

  /**
   * Gets global ranking
   */
  getGlobalRanking(page: number = 1, limit: number = 50): Observable<Ranking[]> {
    const url = `${this.endpointUrl}/global?page=${page}&limit=${limit}`;
    return this.http.get<RankingResponse>(url).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response))
    );
  }

  /**
   * Gets ranking by level
   */
  getRankingByLevel(level: string, page: number = 1, limit: number = 50): Observable<Ranking[]> {
    const url = `${this.endpointUrl}/level/${level}?page=${page}&limit=${limit}`;
    return this.http.get<RankingResponse>(url).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response))
    );
  }

  /**
   * Gets ranking by country
   */
  getRankingByCountry(country: string, page: number = 1, limit: number = 50): Observable<Ranking[]> {
    const url = `${this.endpointUrl}/country/${country}?page=${page}&limit=${limit}`;
    return this.http.get<RankingResponse>(url).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response))
    );
  }

  /**
   * Gets user's current ranking position
   */
  getUserRanking(userId: number): Observable<Ranking> {
    const url = `${this.endpointUrl}/user/${userId}`;
    return this.http.get<RankingResource>(url).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }
}

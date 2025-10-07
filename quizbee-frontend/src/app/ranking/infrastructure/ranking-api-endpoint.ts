import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Ranking } from '../domain/model/ranking.entity';
import { RankingResource, RankingResponse } from './ranking-response';
import { RankingAssembler } from './ranking-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Added missing RxJS operators

export class RankingApiEndpoint extends BaseApiEndpoint<Ranking, RankingResource, RankingResponse, RankingAssembler> {

  /**
   * Creates an instance of RankingApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    // Fixed: Use a default path or check your environment file for the correct property name
    const rankingEndpointPath = (environment as any).platformProviderRankingEndpointPath || '/api/rankings';
    super(http, `${environment.platformProviderApiBaseUrl}${rankingEndpointPath}`,
      new RankingAssembler());
  }

  /**
   * Retrieves global rankings
   */
  getGlobalRankings(): Observable<Ranking[]> {
    return this.getAll();
  }

  /**
   * Retrieves rankings by level
   */
  getRankingsByLevel(level: string): Observable<Ranking[]> {
    return this.http.get<RankingResponse | RankingResource[]>(`${this.endpointUrl}?level=${level}`).pipe(
      map((response: RankingResponse | RankingResource[]) => { // Added type annotation
        if (Array.isArray(response)) {
          return response.map((resource: RankingResource) => this.assembler.toEntityFromResource(resource)); // Added type annotation
        }
        return this.assembler.toEntitiesFromResponse(response as RankingResponse);
      }),
      catchError(this.handleError('Failed to fetch rankings by level'))
    );
  }

  /**
   * Retrieves rankings by country
   */
  getRankingsByCountry(country: string): Observable<Ranking[]> {
    return this.http.get<RankingResponse | RankingResource[]>(`${this.endpointUrl}?country=${country}`).pipe(
      map((response: RankingResponse | RankingResource[]) => { // Added type annotation
        if (Array.isArray(response)) {
          return response.map((resource: RankingResource) => this.assembler.toEntityFromResource(resource)); // Added type annotation
        }
        return this.assembler.toEntitiesFromResponse(response as RankingResponse);
      }),
      catchError(this.handleError('Failed to fetch rankings by country'))
    );
  }

  /**
   * Retrieves user ranking
   */
  getUserRanking(userId: number): Observable<Ranking> {
    return this.http.get<RankingResource>(`${this.endpointUrl}/user/${userId}`).pipe(
      map((resource: RankingResource) => this.assembler.toEntityFromResource(resource)), // Added type annotation
      catchError(this.handleError('Failed to fetch user ranking'))
    );
  }
}

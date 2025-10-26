import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Ranking} from '../domain/model/ranking.entity';
import {RankingResponse, RankingResource} from './ranking-response';
import {RankingAssembler} from './ranking-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class RankingApiEndpoint extends BaseApiEndpoint<Ranking, RankingResource, RankingResponse, RankingAssembler> {

  constructor(http: HttpClient) {
    super(http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderRankingsEndpointPath}`,
      new RankingAssembler()
    );
  }
}


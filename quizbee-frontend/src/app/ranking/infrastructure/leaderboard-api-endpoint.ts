import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Leaderboard} from '../domain/model/leaderboard.entity';
import {LeaderboardResponse, LeaderboardResource} from './ranking-response';
import {LeaderboardAssembler} from './leaderboard-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class LeaderboardApiEndpoint extends BaseApiEndpoint<Leaderboard, LeaderboardResource, LeaderboardResponse, LeaderboardAssembler> {

  constructor(http: HttpClient) {
    super(http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderLeaderboardsEndpointPath}`,
      new LeaderboardAssembler()
    );
  }
}

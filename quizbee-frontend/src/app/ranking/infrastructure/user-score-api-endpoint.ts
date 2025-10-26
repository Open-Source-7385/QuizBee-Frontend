import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {UserScore} from '../domain/model/user-score.entity';
import {UserScoreResponse, UserScoreResource} from './ranking-response';
import {UserScoreAssembler} from './user-score-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class UserScoreApiEndpoint extends BaseApiEndpoint<UserScore, UserScoreResource, UserScoreResponse, UserScoreAssembler> {

  constructor(http: HttpClient) {
    super(http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderUserScoresEndpointPath}`,
      new UserScoreAssembler()
    );
  }
}

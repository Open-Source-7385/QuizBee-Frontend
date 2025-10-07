import { environment } from '../../../environments/environment';

export class BaseApiEndpoint {
  protected baseUrl: string = environment.apiUrl;

  protected getEndpoint(resource: string): string {
    return `${this.baseUrl}/${resource}`;
  }
}

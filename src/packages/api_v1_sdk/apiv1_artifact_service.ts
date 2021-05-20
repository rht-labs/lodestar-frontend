import { Artifact } from '../../schemas/engagement';
import {
  ArtifactFilter,
  ArtifactService,
} from '../../services/artifact_service/artifact_service';
import { getApiV1HttpClient } from './client';

export class Apiv1ArtifactService implements ArtifactService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private buildQueryString({ page = 1, perPage = 10 }: ArtifactFilter): string {
    const queries: string[] = [];
    queries.push(`perPage=${perPage}`);
    queries.push(`page=${page}`);
    return queries.join('&');
  }
  private apiResponseToArtifact = (apiResponseObject: any): Artifact => {
    return {
      description: apiResponseObject['description'],
      linkAddress: apiResponseObject['link_address'],
      uuid: apiResponseObject['uuid'],
      title: apiResponseObject['title'],
      type: apiResponseObject['type'],
    };
  };
  async getArtifacts(filter: ArtifactFilter = {}): Promise<Artifact[]> {
    const queryString = this.buildQueryString(filter);
    const { data } = await this.axios.get(
      `/engagements/artifacts?${queryString}`
    );
    const artifacts = data.map(this.apiResponseToArtifact);
    return artifacts;
  }
}

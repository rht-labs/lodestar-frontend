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
  private buildQueryString({
    page = 1,
    perPage = 10,
    startDate,
    endDate,
    regions,
    type,
  }: ArtifactFilter): string {
    const queries: string[] = [];
    queries.push(`perPage=${perPage}`);
    queries.push(`page=${page}`);
    const searchParams = [];
    if (!!type) {
      searchParams.push(`artifacts.type=${type}`);
    }
    if (startDate != null) {
      searchParams.push(`start=${startDate.toISOString().split('T')[0]}`);
    }
    if (endDate != null) {
      searchParams.push(`start=${endDate.toISOString().split('T')[0]}`);
    }
    if (regions.length > 0) {
      searchParams.push(`engagement_region=${regions.join(',')}`);
    }
    if (searchParams.length > 0) {
      queries.push(`search=${encodeURIComponent(searchParams.join('&'))}`);
    }
    return queries.join('&');
  }
  private apiResponseToArtifact = (apiResponseObject: any): Artifact => {
    return {
      description: apiResponseObject['description'],
      linkAddress: apiResponseObject['link_address'],
      uuid: apiResponseObject['uuid'],
      title: apiResponseObject['title'],
      type: apiResponseObject['type'],
      engagement_uuid: apiResponseObject['engagement_uuid'],
    };
  };
  async getArtifacts(filter: ArtifactFilter = {}): Promise<Artifact[]> {
    const queryString = this.buildQueryString(filter);
    const { data } = await this.axios.get(
      `/engagements/artifacts?${queryString}`,
      {
        headers: { "Accept-version": "v1" }
      }
    );
    const artifacts = data.map(this.apiResponseToArtifact);
    return artifacts;
  }
}

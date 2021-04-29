import { Artifact } from '../../schemas/engagement';
import { ArtifactService } from '../../services/artifact_service/artifact_service';
import { getApiV1HttpClient } from './client';

export class Apiv1ArtifactService implements ArtifactService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private apiResponseToZrtifact = (apiResponseObject: any): Artifact => {
    return {
      description: apiResponseObject['description'],
      linkAddress: apiResponseObject['link_address'],
      id: apiResponseObject['uuid'],
      title: apiResponseObject['title'],
      type: apiResponseObject['type'],
    };
  };
  async getArtifacts(): Promise<Artifact[]> {
    const { data } = await this.axios.get('/engagements/artifacts');
    const engagementUseCases = data.map(this.apiResponseToZrtifact);
    return engagementUseCases;
  }
}

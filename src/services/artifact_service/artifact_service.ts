import { Artifact } from '../../schemas/engagement';

export interface ArtifactFilter {
  page?: number;
  perPage?: number;
}
export interface ArtifactService {
  getArtifacts(filter?: ArtifactFilter): Promise<Artifact[]>;
}

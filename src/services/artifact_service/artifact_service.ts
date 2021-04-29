import { Artifact } from '../../schemas/engagement';

export interface ArtifactService {
  getArtifacts(): Promise<Artifact[]>;
}

import { Artifact } from '../../schemas/engagement';

export interface ArtifactFilter {
  type?: string;
  page?: number;
  perPage?: number;
  startDate?: Date;
  endDate?: Date;
  regions?: string[];
}
export interface ArtifactService {
  getArtifacts(filter?: ArtifactFilter): Promise<Artifact[]>;
}

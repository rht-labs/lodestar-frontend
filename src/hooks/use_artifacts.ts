import { useCallback, useState } from 'react';
import { Artifact } from '../schemas/engagement';
import {
  ArtifactFilter,
  ArtifactService,
} from '../services/artifact_service/artifact_service';

export const useArtifacts = (artifactService: ArtifactService) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const getArtifacts = useCallback(
    async (filter: ArtifactFilter) => {
      const result = await artifactService.getArtifacts(filter);
      setArtifacts(result);
    },
    [artifactService]
  );

  return [artifacts, getArtifacts] as [
    Artifact[],
    (filter?: ArtifactFilter) => Promise<void>
  ];
};

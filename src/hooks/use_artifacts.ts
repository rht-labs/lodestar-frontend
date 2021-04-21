import { useCallback, useState } from 'react';
import { Artifact } from '../schemas/engagement';
import { ArtifactService } from '../services/artifact_service/artifact_service';

export const useArtifacts = (artifactService: ArtifactService) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const getUseCases = useCallback(async () => {
    const result = await artifactService.getArtifacts();
    setArtifacts(result);
  }, [artifactService]);

  return [artifacts, getUseCases] as [Artifact[], () => Promise<void>];
};

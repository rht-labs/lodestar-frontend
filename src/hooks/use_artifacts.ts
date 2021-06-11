import { useCallback, useState } from 'react';
import { Artifact } from '../schemas/engagement';
import {
  ArtifactFilter,
} from '../services/artifact_service/artifact_service';

export const useArtifacts = (fetcher: () => Promise<Artifact[]>) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const getArtifacts = useCallback(async () => {
    setArtifacts(await fetcher());
  }, [fetcher]);

  return [artifacts, getArtifacts] as [
    Artifact[],
    (filter?: ArtifactFilter) => Promise<void>
  ];
};

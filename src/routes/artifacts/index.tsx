import React, { useEffect, useState } from 'react';
import { Artifact } from '../../schemas/engagement';
import { ArtifactService } from '../../services/artifact_service/artifact_service';
import { Card, CardBody, CardHeader } from '@patternfly/react-core';

const useArtifacts = (artifactService: ArtifactService) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    artifactService
      .getArtifacts({
        regions: [],
      })
      .then(newArtifacts => setArtifacts(newArtifacts))
      .finally(() => setIsLoading(false));
  }, [artifactService]);
  return {
    artifacts,
    isLoading,
  };
};

export interface ArtifactViewProps {
  artifactService: ArtifactService;
}
export const ArtifactView = (props: ArtifactViewProps) => {
  const { artifacts, isLoading } = useArtifacts(props.artifactService);

  if (isLoading) {
    return <div>Artifacts are loading</div>;
  }
  return (
    <Card>
      <CardHeader>Artifacts</CardHeader>
      <CardBody>
        {artifacts?.map(artifact => (
          <tr>
            <pre>{JSON.stringify(artifact)}</pre>
          </tr>
        ))}
      </CardBody>
    </Card>
  );
};

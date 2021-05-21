import React, { useEffect } from 'react';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useArtifacts } from '../hooks/use_artifacts';
import { Artifact } from '../schemas/engagement';
import { ArtifactFilter } from '../services/artifact_service/artifact_service';

type ArtifactsComponent<P> = React.FunctionComponent<
  P & {
    artifacts: Artifact[];
  }
>;

export function withArtifacts<P>(
  WrappedComponent: ArtifactsComponent<P>,
  filter: ArtifactFilter = {}
) {
  return <ArtifactFetcher filter={filter} component={WrappedComponent} />;
}

interface ArtifactFetcherProps<P> {
  component: ArtifactsComponent<P>;
  filter?: ArtifactFilter;
}

const ArtifactFetcher = (props: ArtifactFetcherProps<any>) => {
  const { component: WrappedComponent } = props;
  const { artifactService } = useServiceProviders();
  const [artifacts, fetchArtifacts] = useArtifacts(artifactService);
  useEffect(() => {
    fetchArtifacts(props.filter);
  }, [fetchArtifacts, props.filter]);
  return <WrappedComponent {...props} artifacts={artifacts} />;
};

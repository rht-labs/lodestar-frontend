import React, { useEffect } from 'react';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useArtifacts } from '../hooks/use_artifacts';
import { Artifact } from '../schemas/engagement';

type ArtifactsComponent<P> = React.FunctionComponent<
  P & {
    categories: Artifact[];
  }
>;

export function withArtifacts<P>(WrappedComponent: ArtifactsComponent<P>) {
  return <ArtifactFetcher component={WrappedComponent} />;
}

interface ArtifactFetcherProps<P> {
  component: ArtifactsComponent<P>;
}

const ArtifactFetcher = (props: ArtifactFetcherProps<any>) => {
  const { component: WrappedComponent } = props;
  const { artifactService } = useServiceProviders();
  const [artifacts, fetchArtifacts] = useArtifacts(artifactService);
  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);
  return <WrappedComponent {...props} artifacts={artifacts} />;
};

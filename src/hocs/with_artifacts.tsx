import React, { useEffect } from 'react';
import { useArtifacts } from '../hooks/use_artifacts';
import { Artifact } from '../schemas/engagement';

type ArtifactsComponent<P> = React.FunctionComponent<
  P & {
    artifacts: Artifact[];
  }
>;

export function withArtifacts<P>(
  WrappedComponent: ArtifactsComponent<P>,
  fetcher: () => Promise<Artifact[]>
) {
  return <ArtifactFetcher component={WrappedComponent} fetcher={fetcher} />;
}

interface ArtifactFetcherProps<P> {
  component: ArtifactsComponent<P>;
  fetcher: () => Promise<Artifact[]>;
}

const ArtifactFetcher = (props: ArtifactFetcherProps<any>) => {
  const { component: WrappedComponent } = props;
  const [artifacts, fetchArtifacts] = useArtifacts(props.fetcher);
  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);
  return <WrappedComponent {...props} artifacts={artifacts} />;
};

import React, { useEffect, useState } from 'react';
import { useArtifacts } from '../hooks/use_artifacts';
import { Artifact, Engagement } from '../schemas/engagement';

type ArtifactsComponent<P> = React.FunctionComponent<
  P & {
    artifacts: Artifact[];
    engagements: Partial<Engagement>[];
  }
>;

export function withArtifacts<P>(
  WrappedComponent: ArtifactsComponent<P>,
  fetcher: () => Promise<Artifact[]>,
  fetchEngagementById: (id: string) => Promise<Partial<Engagement>>
) {
  return (
    <ArtifactFetcher
      component={WrappedComponent}
      fetcher={fetcher}
      getEngagementById={fetchEngagementById}
    />
  );
}

interface ArtifactFetcherProps<P> {
  component: ArtifactsComponent<P>;
  fetcher: () => Promise<Artifact[]>;
  getEngagementById: (id: string) => Promise<Partial<Engagement>>;
}

const ArtifactFetcher = (props: ArtifactFetcherProps<any>) => {
  const { component: WrappedComponent, getEngagementById } = props;
  const [artifacts, fetchArtifacts] = useArtifacts(props.fetcher);
  const [engagements, setEngagements] = useState([]);
  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);
  useEffect(() => {
    Promise.all(
      artifacts.map(artifact => getEngagementById(artifact.engagement_uuid))
    ).then(engagements => setEngagements(engagements));
  }, [artifacts, getEngagementById]);
  return (
    <WrappedComponent
      {...props}
      artifacts={artifacts}
      engagements={engagements}
    />
  );
};

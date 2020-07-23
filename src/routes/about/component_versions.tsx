import React from 'react';
import {
  Grid,
  GridItem,
} from '@patternfly/react-core';

interface ComponentVersionProps {
  versionContext: any;
}

export function ComponentVersions(props: ComponentVersionProps) {

  let cardItems = [];

  if (!!props.versionContext?.versions?.versions) {

    cardItems = Object.keys(props.versionContext.versions?.versions).reduce(
      (previousComponents, currentKey, reduceIndex) => {
        if (!Array.isArray(props.versionContext.versions.versions[currentKey])) {
          return previousComponents;
        }
        return [
          ...previousComponents,
          ...((props.versionContext?.versions?.versions[currentKey] ?? []).map(
            (version, mapIndex) => {
              let label = '';
              if (
                version.application === 'omp-frontend' &&
                version.version.charAt(0) !== 'v'
              ) {
                label = version.git_tag;
              } else {
                label = version.version;
              }
              return (
                <Grid hasGutter span={6} style={{marginLeft: '1rem'}}>
                  <GridItem span={2}>
                    <b>{version?.application}:</b>
                  </GridItem>
                  <GridItem span={6}>
                    {label}
                  </GridItem>
                </Grid>
              );
            }
          ) ?? []),
        ];
      },
      []
    );
  }

  return (
    <>
      { cardItems }
    </>
  );
}

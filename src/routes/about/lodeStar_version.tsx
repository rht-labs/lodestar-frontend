import React from 'react';
import { Grid, GridItem, Text } from '@patternfly/react-core';

interface LodeStarVersionProps {
  versionContext: any;
}

export function LodeStarVersion(props: LodeStarVersionProps) {
  let lodeStarVersion = null;
  let lodestar;

  if (!!props.versionContext?.versions?.versions) {
    // Find LodeStar app version (if it exists) and move it to the top
    lodestar = props.versionContext.versions?.versions?.applications?.find(
      e => e.application === 'lodestar'
    );

    if (lodestar) {
      lodeStarVersion = lodestar.version;
      // Remove it from the component version list
      const index = props.versionContext.versions?.versions.applications.indexOf(
        lodestar
      );
      props.versionContext.versions?.versions.applications.splice(index, 1);
    } else {
      lodeStarVersion = 'Unknown';
    }
  }
  return (
    <>
      <Grid lg={6} md={12}>
        <GridItem lg={2} md={6}>
          <b>LodeStar version: </b>
        </GridItem>
        <GridItem lg={2} md={6}>
          {lodestar?.link_address ? (
            <a href={lodestar?.link_address} data-cy="lodestar_version_linked">
              {lodeStarVersion}
            </a>
          ) : (
            <Text data-cy="lodestar_version">{lodeStarVersion}</Text>
          )}
        </GridItem>
      </Grid>
    </>
  );
}


import React from 'react';
import { Grid, GridItem, Text } from '@patternfly/react-core';

interface LodeStarVersionProps {
  versionContext: any;
}

export function LodeStarVersion(props: LodeStarVersionProps) {

  function lodeStar() {
    if (!!props.versionContext?.versions?.main_version) {
      return props.versionContext?.versions?.main_version;
    }
    else
      return 'Unknown'
  };

  return (
    <>
      <Grid hasGutter span={6} style={{marginLeft: '1rem'}}>
        <GridItem span={2}>
          <b>LodeStar version </b>
        </GridItem>
        <GridItem span={4}>
          <Text data-cy="lodestar_version">{lodeStar()?.value}</Text>
        </GridItem>
      </Grid>
    </>
  );
}


import React, { useContext } from 'react';
import { Grid, GridItem, Text } from '@patternfly/react-core';
import { VersionContext } from '../../context/version_context/version_context';

export function LodeStarVersion() {
  const versionContext = useContext(VersionContext);

  function lodeStar() {
    if (!!versionContext?.versions?.mainVersion) {
      return versionContext?.versions?.mainVersion.value;
    } else return 'Unknown';
  }

  return (
    <>
      <Grid hasGutter span={6} style={{ marginLeft: '1rem' }}>
        <GridItem span={2}>
          <b>LodeStar version </b>
        </GridItem>
        <GridItem span={4}>
          <Text data-cy="lodestar_version">{lodeStar()}</Text>
        </GridItem>
      </Grid>
    </>
  );
}

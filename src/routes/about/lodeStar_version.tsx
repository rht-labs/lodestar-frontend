import React from 'react';
import {
  CardBody,
  Grid,
  GridItem
} from '@patternfly/react-core';

interface LodeStarVersionProps {
  versionContext: any;
}

export function LodeStarVersion(props: LodeStarVersionProps) {
  let lodeStarVersion = null;

  if (!!props.versionContext?.versions?.versions) {
    // Find LodeStar app version (if it exists) and move it to the top
    let lodestarVersion = props.versionContext.versions?.versions?.applications?.find(e => e.application === "lodestar");

    if (lodestarVersion) {
      lodeStarVersion = lodestarVersion.version;
      // Remove it from the component version list
      const index = props.versionContext.versions?.versions.applications.indexOf(lodestarVersion);
      props.versionContext.versions?.versions.applications.splice(index, 1);
    } else {
      lodeStarVersion = 'Unknown';
    }
  }
  return (
    <CardBody>
      <Grid span={6}>
        <GridItem span={2}>
          <b>LodeStar version: </b>
        </GridItem>
        <GridItem span={2}>
          <a href={'https://gitlab.consulting.redhat.com/rht-labs/labs-sre/documentation/-/wikis/LodeStar-Release-Notes'}>
            { lodeStarVersion }
          </a>
        </GridItem>
      </Grid>
    </CardBody>
  );
}
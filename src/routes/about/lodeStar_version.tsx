import React from 'react';
import {
  CardBody,
} from '@patternfly/react-core';

export interface LodeStarVersionProps {
  versionContext: any;
}

export function LodeStarVersion(props: LodeStarVersionProps) {
  let lodeStarVersion = null;

  if (!!props.versionContext?.versions?.versions) {
    // Find LodeStar app version (if it exists) and move it to the top
    let lodestarVersion = props.versionContext.versions?.versions?.applications?.find(e => e.application === "lodestar");

    if (lodestarVersion) {
      lodeStarVersion = <CardBody>
        <div>
          <b>LodeStar</b>: <span>{lodestarVersion.version}</span>
        </div>
      </CardBody>;
      // Remove it from the component version list
      const index = props.versionContext.versions?.versions.applications.indexOf(lodestarVersion);
      props.versionContext.versions?.versions.applications.splice(index, 1);
    } else {
      lodeStarVersion = <CardBody>
        <div>
          <b>LodeStar</b>: <span>Unknown</span>
        </div>
      </CardBody>
    }
  }
  return lodeStarVersion;
}
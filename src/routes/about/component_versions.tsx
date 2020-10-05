import React from 'react';
import {
  Grid,
  GridItem,
} from '@patternfly/react-core';

interface ComponentVersionProps {
  versionContext: any;
}

export function ComponentVersions(props: ComponentVersionProps) {

  function allComponents() {
    if (!!props.versionContext?.versions?.versions?.component_versions) {
      return props.versionContext?.versions?.versions?.component_versions;
    }
    else
      return [{name: '', value:''}]
  };

  return (
    <>
      <Grid lg={6} md={12} style={{marginTop: '1rem'}}>
        <GridItem span={12}>
          <b>Components versions: </b>
        </GridItem>
        <GridItem span={12}>
          <Grid span={12}>
            {
              allComponents().map( component =>
                <>
                  <GridItem>
                    <b>
                      { component.name }:
                    </b>
                    { component.value }
                  </GridItem>
                </>
              )
            }
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

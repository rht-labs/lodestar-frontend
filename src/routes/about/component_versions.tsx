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
    if (!!props.versionContext?.versions?.component_versions) {
      return props.versionContext?.versions?.component_versions;
    }
    else
      return [{name: '', value:''}]
  };

  return (
    <>
      <Grid span={6} style={{marginTop: '1rem'}}>
        <GridItem span={12} style={{marginLeft: '1rem'}}>
          <b>Components versions </b>
        </GridItem>
        <GridItem span={12}>
          <Grid span={12}>
            {
              allComponents().map( component =>
                <>
                  <Grid hasGutter span={6} style={{marginLeft: '1rem'}}>
                    <GridItem span={2}>
                      { component.name }
                    </GridItem>
                    <GridItem span={2}>
                      { component.value }
                    </GridItem>
                  </Grid>
                </>
              )
            }
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

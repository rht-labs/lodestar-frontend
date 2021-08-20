import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { IVersionContext } from '../../context/version_context/version_context';
import { Version } from '../../schemas/version';

interface ComponentVersionProps {
  versionContext: IVersionContext;
}

export function ComponentVersions(props: ComponentVersionProps) {
  const components = (function allComponents(): Version[] {
    if (!!props.versionContext?.versions?.componentVersions) {
      return props.versionContext?.versions?.componentVersions;
    } else return [{ name: '', value: '', link_address: '' }];
  })();
  return (
    <>
      <Grid span={6} style={{ marginTop: '1rem' }}>
        <GridItem span={12} style={{ marginLeft: '1rem' }}>
          <b>Components versions </b>
        </GridItem>
        <GridItem span={12}>
          <Grid span={12}>
            {components.map(component => (
              <div key={component.name}>
                <Grid hasGutter span={6} style={{ marginLeft: '1rem' }}>
                  <GridItem span={2}>{component.name}</GridItem>
                  <GridItem span={2}>{component.value}</GridItem>
                </Grid>
              </div>
            ))}
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@patternfly/react-core';
import { useVersion } from '../../context/version_context/version_context';

function _Admin() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15,
  };

  const versionContext = useVersion();

  useEffect(() => {
    if (!versionContext.versions) {
      versionContext.fetchVersions();
    }
  }, [versionContext]);

  let cardItems = [];

  if (!!versionContext?.versions?.versions) {
    cardItems = Object.keys(versionContext.versions?.versions).reduce(
      (previousComponents, currentKey, reduceIndex) => {
        if (!Array.isArray(versionContext.versions.versions[currentKey])) {
          return previousComponents;
        }
        return [
          ...previousComponents,
          ...((versionContext?.versions?.versions[currentKey] ?? []).map(
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
                <CardBody key={`${reduceIndex}${mapIndex}`}>
                  <div>
                    <b>{version?.application}</b>: <span>{label}</span>
                  </div>
                </CardBody>
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
      <div style={contentPane}>
        <h1>Administration Pane</h1>
        <p>
          This is where administrators monitor the application and control their
          minions!
        </p>
        <Card isCompact={true}>
          <CardHeader>Component Versions</CardHeader>
          {cardItems}
        </Card>
      </div>
    </>
  );
}

export const Admin = React.memo(_Admin);

import React, {useContext, useEffect} from 'react';
import { Card, CardHeader, CardBody } from '@patternfly/react-core';
import { VersionContext } from '../../context/version_context';

export function Admin() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15
  };

  const versionContext = useContext(VersionContext);

  useEffect(() => {
    if (!versionContext.versions) {
      versionContext.fetchVersions();
    }
    }, [versionContext]
  );

  console.log(versionContext.versions);
  let cardItems = [];

  if(versionContext.versions !== undefined){
    console.log(versionContext.versions.fe);
    // cardItems = versionContext.versions.applications
    //   .map((application, index) => {
    //     return (
    //       <CardBody
    //         key={index}
    //       >
    //         <div>{application.application}</div>
    //         <span>{application.version}</span>
    //       </CardBody>
    //     );
    //   });
  }

  return (
    <>
      <div style={contentPane}>
        <h1>Administration Pane</h1>
        <p>This is where administrators monitor the application and control their minions!</p>
        <Card isCompact={true}>
          <CardHeader>Component Versions</CardHeader>
          <CardBody>This card has no footer</CardBody>
          {cardItems}
        </Card>
      </div>
    </>
  );
}

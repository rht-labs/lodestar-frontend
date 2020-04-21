import React, { useContext } from 'react';
import { Button } from '@patternfly/react-core';

import { EngagementContext } from '../context/engagement_context';
import { slugProperties } from '../utilities/slug_properties';

function _OMPEngagementButtonPane() {
  const engagementContext = useContext(EngagementContext);
  console.log(engagementContext);
  
  const buttonPane: React.CSSProperties = {
    color: 'pink',
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    padding: 5,
    borderRadius: 4,
  }

  const buttonDisplay: React.CSSProperties = {
    margin: 5,
  }

  const launchCluster = () => {
    console.log("funk");
    engagementContext.createEngagement(
      slugProperties(values, [
        'ocp_sub_domain',
        'customer_name',
        'project_name',
      ])
    );
  }


  return (
    <div style={ buttonPane } >
      <Button style={ buttonDisplay }>Save</Button>
      <Button
        style={ buttonDisplay }
        onClick={launchCluster}>Launch</Button>
    </div>
  );
}

export const OMPEngagementButtonPane = React.memo(_OMPEngagementButtonPane);
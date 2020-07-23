import React from 'react';
import {
  TextVariants,
  Text
} from "@patternfly/react-core";

export function AboutText() {
return(
  <>
    <Text component={TextVariants.small} style={{textAlign: 'justify'}}>
      <a href={'https://gitlab.consulting.redhat.com/rht-labs/labs-sre/documentation/-/wikis/LodeStar-Overview'}>
        LodeStar
      </a> is an application that provides an intuitive interface to allow team members to manage an Open Innovation Labs Engagement, including the provisioning and population of hosting environments, such as OpenShift Container Platform.
      <br/>
      The underlying orchestration automation will then process the input data and perform the necessary steps to build out the hosting environment, onboard users, etc. that will build the necessary toolset for the residency.
      This allows for better management of the engagements and enables more self-service for the delivery team.
      <br/> Please read&nbsp;
      <a href={'https://docs.google.com/document/d/1lMl1IxFFXiWztSDc8hTeesYkqn_vqpuAt2X2JrSgCB8/edit'}>
        LodeStar User Guide
      </a>
      &nbsp;for more details.
    </Text>
  </>
)
}
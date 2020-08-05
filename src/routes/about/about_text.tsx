import React from 'react';
import {
  TextVariants,
  Text, Title
} from "@patternfly/react-core";
import { useConfig } from "../../context/config_context/config_hook";

export function AboutText() {
  const { appConfig } = useConfig();
return(
  <>
    <Title headingLevel="h2" style={{fontWeight: 'lighter', margin:'0.5rem 0'}}>
      About
    </Title>
    <Text component={TextVariants.small} style={{textAlign: 'justify'}}>
      {
        appConfig?.LodeStarWiki ? (
          <a href={appConfig?.LodeStarWiki}>
            LodeStar
          </a>
        ) : (
          <>
            LodeStar
          </>
        )
      }
      &nbsp;is an application that provides an intuitive interface to allow team members to manage an Open Innovation Labs Engagement, including the provisioning and population of hosting environments, such as OpenShift Container Platform.
      The underlying orchestration automation will then process the input data and perform the necessary steps to build out the hosting environment, onboard users, etc. that will build the necessary toolset for the residency.
      This allows for better management of the engagements and enables more self-service for the delivery team.
      Please read&nbsp;
      {
        appConfig?.LodeStarUserGuide ? (
          <a href={appConfig?.LodeStarUserGuide}>
            LodeStar User Guide
          </a>
        ) : (
          <>
            LodeStar User Guide
          </>
        )
      }
      &nbsp;for more details.
    </Text>
  </>
)
}
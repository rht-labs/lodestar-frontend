import React from 'react';
import {
  TextVariants,
  Text, Title
} from "@patternfly/react-core";
import { useConfig } from "../../context/config_context/config_hook";

export function NeedHelp() {

  const { appConfig } = useConfig();

  return(
    <>
      <Title headingLevel="h2" style={{fontWeight: 'lighter', margin:'0.5rem 0'}}>
        Need Help?
      </Title>
      <Text component={TextVariants.small}>
        Have questions or need help? Please checkout&nbsp;
        {
          appConfig?.lodeStarFAQ ? (
            <>
              <a href={appConfig?.lodeStarFAQ}>
                LodeStar FAQ
              </a>
            </>
          ) : (
            <>
              LodeStar FAQ
            </>
          )
        }
        &nbsp; or send an email to&nbsp;
        <a
          href={
            appConfig?.supportEmailAddress
              ? `mailto:${appConfig?.supportEmailAddress}`
              : '#'
          }
        >
          {appConfig?.supportEmailAddress ?? ''}
        </a>
      </Text>
    </>
  )
}
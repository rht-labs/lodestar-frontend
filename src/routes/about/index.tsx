import React, { useEffect } from 'react';
import {
  PageSection,
  Text,
  Page,
  SkipToContent,
  Grid,
  GridItem,
  Title,
  TextVariants
} from '@patternfly/react-core';
import { useVersion } from '../../context/version_context/version_context';
import { ComponentVersions } from "./component_versions";
import { LodeStarVersion } from "./lodeStar_version";
import { AboutText } from "./about_text";
import { useConfig } from "../../context/config_context/config_hook";

export function About() {
  const versionContext = useVersion();

  useEffect(() => {
    if (!versionContext.versions) {
      versionContext.fetchVersions();
    }
  }, [versionContext]);

  const { appConfig } = useConfig();
  const pageId = 'main-content-page-layout-default-nav';
  const PageSkipToContent = (
    <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>
  );

  return (
    <>
      <Page
        isManagedSidebar
        skipToContent={PageSkipToContent}
        mainContainerId={pageId}
      >
        <PageSection>
          <Title headingLevel="h1" style={{fontWeight: 'normal', marginBottom: '1rem'}}>
            LodeStar
          </Title>
          <Grid hasGutter span={10}>
            <GridItem>
              <Title headingLevel="h2" style={{fontWeight: 'lighter', margin:'0.5rem 0'}}>
                About
              </Title>
              <AboutText/>
            </GridItem>
            <GridItem>
              <Title headingLevel="h2" style={{fontWeight: 'lighter', margin:'0.5rem 0'}}>
                Need Help?
              </Title>
              <Text component={TextVariants.small}>
                Have questions or need help? Please checkout&nbsp;
                <a href={'https://gitlab.consulting.redhat.com/rht-labs/labs-sre/documentation/-/wikis/LodeStar-FAQ'}>
                  LodeStar FAQ
                </a>
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
            </GridItem>
            <GridItem>
              <Title headingLevel="h2" style={{fontWeight: 'lighter', margin:'0.5rem 0'}}>
                Version
              </Title>
              <Text component={TextVariants.small}>
                <LodeStarVersion versionContext={versionContext}/>
                <ComponentVersions versionContext={versionContext}/>
              </Text>
            </GridItem>
          </Grid>
        </PageSection>
      </Page>
    </>
  );
}


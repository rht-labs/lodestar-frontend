import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Page,
  SkipToContent,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { useVersion } from '../../context/version_context/version_context';
import { ComponentVersions } from "./component_versions";
import {LodeStarVersion} from "./lodeStar_version";

export function About() {
  const versionContext = useVersion();

  useEffect(() => {
    if (!versionContext.versions) {
      versionContext.fetchVersions();
    }
  }, [versionContext]);

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
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">About</Text>
            <Text component="p">
              This is where versions of the application can be tracked.
            </Text>
          </TextContent>
        </PageSection>
        <PageSection>
          <Grid>
            <GridItem span={4}>
              <Card isCompact={true}>
                <CardHeader>LodeStar Version</CardHeader>
                <LodeStarVersion versionContext={versionContext} />
                <CardHeader>Component Versions</CardHeader>
                <ComponentVersions />
              </Card>
            </GridItem>
          </Grid>
        </PageSection>
      </Page>
    </>
  );
}


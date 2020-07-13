import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
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

export function About() {
  const versionContext = useVersion();

  useEffect(() => {
    if (!versionContext.versions) {
      versionContext.fetchVersions();
    }
  }, [versionContext]);

  let cardItems = [];
  let applicationCard = null;

  if (!!versionContext?.versions?.versions) {
    // Find LodeStar app version (if it exists) and move it to the top
    let lodestarVersion = versionContext.versions?.versions?.applications?.find(e => e.application === "lodestar")
    if (lodestarVersion) {
      applicationCard = <CardBody>
        <div>
          <b>LodeStar</b>: <span>{lodestarVersion.version}</span>
        </div>
      </CardBody>
      // Remove it from the component version list
      const index = versionContext.versions?.versions.applications.indexOf(lodestarVersion);
      versionContext.versions?.versions.applications.splice(index, 1);
    } else {
      applicationCard = <CardBody>
        <div>
          <b>LodeStar</b>: <span>Unknown</span>
        </div>
      </CardBody>
    }

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
                {applicationCard}
                <CardHeader>Component Versions</CardHeader>
                {cardItems}
              </Card>
            </GridItem>
          </Grid>
        </PageSection>
      </Page>
    </>
  );
}

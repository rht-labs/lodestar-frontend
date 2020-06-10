import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Gallery,
  GalleryItem,
  Page,
  SkipToContent
} from '@patternfly/react-core';
import { useVersion } from '../../context/version_context/version_context';

function About() {

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

  const pageId = 'main-content-page-layout-default-nav';
  const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;

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
          <Gallery>
            <GalleryItem>
              <Card isCompact={true}>
                <CardHeader>Component Versions</CardHeader>
                {cardItems}
              </Card>
            </GalleryItem>
          </Gallery>
        </PageSection>
      </Page>
    </>
  );
}

export const Admin = React.memo(About);

import React from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  TextContent,
} from '@patternfly/react-core';
export function Dashboard() {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Title headingLevel="h1">Dashboard</Title>
        </TextContent>
      </PageSection>
      <PageSection>
        <h1>Dashboard</h1>
        <p>
          This is a super fancy dashboard where people mine data about all of
          the amazing engagements taking place in the Labs Universe.
        </p>
        <p>
          <b>If you squint really hard, you can see it!!!</b>
        </p>
        <p>
          Please make a selection from the nav menu (top of screen -
          house/list/cog - hold over to see tooltip)
        </p>
        <p>
          Select the raised hand to be taken to the feedback form to report any
          issues, share thoughts or provide suggestions.
        </p>
      </PageSection>
    </>
  );
}

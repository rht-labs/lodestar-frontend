import React, { useState } from 'react';
import { EngagementViewProps } from '..';
import { Loading } from '../Loading';
import { Tabs, Tab, Grid, GridItem, TextContent } from '@patternfly/react-core';
import { BasicInformation } from '../form_views/01_basic_information';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { PointOfContact } from '../form_views/02_point_of_contact';
import { ClusterUsers } from '../form_views/04_cluster_users';
import { ClusterInformation } from '../form_views/03_cluster_information';
import { Engagement } from '../../../schemas/engagement_schema';
import { EngagementSummaryCard } from '../data_cards/engagement_summary_card';
import { PointOfContactCard } from '../data_cards/point_of_contact_card';
import { OpenshiftClusterSummaryCard } from '../data_cards/openshift_cluster_summary';

interface EngagementTabViewProps extends EngagementViewProps {}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
  } = useEngagements();
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabSelect = (e, tabIndex) => setCurrentTab(tabIndex);
  if (!engagement) {
    return <Loading />;
  }
  return (
    <Tabs isBox activeKey={currentTab} onSelect={handleTabSelect}>
      <Tab title="Overview" eventKey={0}>
        <TabContentWrapper>
          <TableDisplayView engagement={engagement} />
        </TabContentWrapper>
      </Tab>
      <Tab title="Basic Information" eventKey={1}>
        <TabContentWrapper>
          <BasicInformation
            formOptions={formOptions}
            values={engagementFormState}
            onChange={updateEngagementFormField}
          />
          <PointOfContact
            values={engagementFormState}
            onChange={updateEngagementFormField}
          />
        </TabContentWrapper>
      </Tab>
      <Tab title="Users" eventKey={2}>
        <TabContentWrapper>
          <ClusterUsers
            formOptions={formOptions}
            values={engagementFormState}
            onChange={updateEngagementFormField}
          />
        </TabContentWrapper>
      </Tab>
      <Tab title="Cluster Information" eventKey={3}>
        <TabContentWrapper>
          <ClusterInformation
            formOptions={formOptions}
            values={engagementFormState}
            onChange={updateEngagementFormField}
          />
        </TabContentWrapper>
      </Tab>
    </Tabs>
  );
}

function TabContentWrapper(props: { children: any }) {
  return <div style={{ paddingTop: 20 }}>{props.children}</div>;
}

function TableDisplayView({ engagement }: { engagement: Engagement }) {
  return (
    <TextContent>
      <div>
        <Grid hasGutter>
          <GridItem span={6}>
            <EngagementSummaryCard engagement={engagement} />
          </GridItem>
          <GridItem span={6}>
            <PointOfContactCard engagement={engagement} />
          </GridItem>
          <GridItem span={12}>
            <OpenshiftClusterSummaryCard engagement={engagement} />
          </GridItem>
        </Grid>
        {/* <Table
          aria-label="Compact expandable table"
          variant={TableVariant.compact}
          rows={Object.keys(engagement).map(k => [
            k,
            JSON.stringify(engagement[k]),
          ])}
          cells={['', '']}
        >
          <TableBody />
        </Table> */}
      </div>
    </TextContent>
  );
}
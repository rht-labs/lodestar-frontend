import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { OpenshiftClusterEditModal } from './openshift_cluster_edit_modal';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';

export interface OpenshiftClusterSummaryCardProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
}

export function OpenshiftClusterSummaryCard({
  engagement,
  onChange,
  formOptions,
}: OpenshiftClusterSummaryCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  console.log(activeModalKey);

  return (
    <>
      <OpenshiftClusterEditModal
        formOptions={formOptions}
        onChange={onChange}
        engagement={engagement}
        isOpen={activeModalKey === OPENSHIFT_MODAL_KEY}
      />
      <DataCard
        isEditable
        onEdit={() => requestOpen(OPENSHIFT_MODAL_KEY)}
        title="Openshift Information"
      >
        <Grid hasGutter>
          <GridItem span={3}>
            <TitledDataPoint title="Cloud Provider">
              {engagement?.ocp_cloud_provider_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Openshift Version">
              {engagement?.ocp_version}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Storage Size">
              {engagement?.ocp_persistent_storage_size}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Cloud Region">
              {engagement?.ocp_cloud_provider_region}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Cloud Provider">
              {engagement?.ocp_cluster_size}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Subdomain">
              {engagement?.ocp_sub_domain}
            </TitledDataPoint>
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}

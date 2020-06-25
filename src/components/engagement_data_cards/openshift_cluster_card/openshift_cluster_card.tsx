import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { OpenShiftClusterEditModal } from '../../engagement_edit_modals/openshift_cluster_edit_modal';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';

export interface OpenShiftClusterSummaryCardProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
}

export function OpenShiftClusterSummaryCard({
  engagement,
  onSave,
  onChange,
  formOptions,
}: OpenShiftClusterSummaryCardProps) {
  const openshiftRequiredFields = [
    'ocp_cloud_provider_name',
    'ocp_cloud_provider_region',
    'ocp_version',
    'ocp_cluster_size',
    'ocp_persistent_storage_size',
    'ocp_sub_domain',
  ];
  const { requestOpen, activeModalKey } = useModalVisibility();
  return (
    <>
      <OpenShiftClusterEditModal
        formOptions={formOptions}
        onChange={onChange}
        onSave={onSave}
        engagement={engagement}
        isOpen={activeModalKey === OPENSHIFT_MODAL_KEY}
      />
      <DataCard
        actionButton={() => (
          <div>
            <RequiredFieldsWarning requiredFields={openshiftRequiredFields} />
            <EditButton onClick={() => requestOpen(OPENSHIFT_MODAL_KEY)} />
          </div>
        )}
        title="Hosting Environment"
      >
        <Grid hasGutter>
          <GridItem span={3}>
            <TitledDataPoint title="Hosting Type">
              OpenShift Container Platform
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Cloud Provider">
              {engagement?.ocp_cloud_provider_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="OpenShift Version">
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
            <TitledDataPoint title="Cluster Size">
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

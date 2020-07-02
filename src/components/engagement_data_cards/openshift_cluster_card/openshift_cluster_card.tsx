import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { OpenShiftClusterEditModal } from '../../engagement_edit_modals/openshift_cluster_edit_modal';
import {
  EngagementFormConfig,
  EngagementFormOption,
} from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';

const OPENSHIFT_MODAL_KEY = 'openshift_modal';

export interface OpenShiftClusterSummaryCardProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}

export function OpenShiftClusterSummaryCard({
  currentEngagement,
  currentEngagementChanges,
  onSave,
  onChange,
  formOptions,
  missingRequiredFields,
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
        engagement={currentEngagementChanges}
        isOpen={activeModalKey === OPENSHIFT_MODAL_KEY}
      />
      <DataCard
        trailingIcon={() =>
          !currentEngagement || currentEngagement?.launch ? (
            <div />
          ) : (
            <RequiredFieldsWarning
              missingRequiredFields={missingRequiredFields}
              requiredFields={openshiftRequiredFields}
            />
          )
        }
        actionButton={() => (
          <div>
            <EditButton
              onClick={() => requestOpen(OPENSHIFT_MODAL_KEY)}
              text={'Edit'}/>
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
              <span>
                {getHumanReadableLabel(
                  formOptions?.cloud_options?.providers?.options,
                  currentEngagement?.ocp_cloud_provider_name
                )}
              </span>
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="OpenShift Version">
              <span>
                {getHumanReadableLabel(
                  formOptions?.openshift_options?.versions?.options,
                  currentEngagement?.ocp_version
                )}
              </span>
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Storage Size">
              <span>
                {getHumanReadableLabel(
                  formOptions?.openshift_options?.persistent_storage?.options,
                  currentEngagement?.ocp_persistent_storage_size
                )}
              </span>
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Cloud Region">
              <span>
                {getHumanReadableLabel(
                  formOptions?.cloud_options?.providers?.options?.find(
                    option =>
                      option.value === currentEngagement?.ocp_cloud_provider_name
                  )?.options ?? [],
                  currentEngagement?.ocp_cloud_provider_region
                )}
              </span>
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Cluster Size">
              <span>
                {getHumanReadableLabel(
                  formOptions?.openshift_options?.cluster_size?.options,
                  currentEngagement?.ocp_cluster_size
                )}
              </span>
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Subdomain">
              {currentEngagement?.ocp_sub_domain}.na-1.rht-labs.com
            </TitledDataPoint>
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}

function getHumanReadableLabel(
  lookupArray: EngagementFormOption[] = [],
  value: string
) {
  return lookupArray?.find(option => option.value === value)?.label;
}

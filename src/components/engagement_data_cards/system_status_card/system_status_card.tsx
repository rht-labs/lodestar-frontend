import React from 'react';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { SubsystemDetails } from './subsystem_details';
import {
  Engagement,
  getEngagementStatus,
  EngagementStatus,
} from '../../../schemas/engagement';
import { SystemStatusDetailsModal } from './system_status_details_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { ClusterStatus } from '../../../schemas/cluster_status';

export interface SystemStatusCardProps {
  currentEngagement: Engagement;
}
const SYSTEM_STATUS_MODAL_KEY = 'system_status';

export function SystemStatusCard({ currentEngagement }: SystemStatusCardProps) {
  const status = currentEngagement?.status;
  const { requestOpen, activeModalKey } = useModalVisibility();
  if (getEngagementStatus(currentEngagement) === EngagementStatus.upcoming) {
    return <div />;
  }
  return (
    <>
      <SystemStatusDetailsModal
        engagement={currentEngagement}
        isOpen={activeModalKey?.includes(SYSTEM_STATUS_MODAL_KEY)}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(SYSTEM_STATUS_MODAL_KEY)}
            text={'View More'}
          />
        )}
        title="System Status"
      >
        <SubsystemStatuses status={status} data-testid="status-card" />
      </DataCard>
    </>
  );
}

function SubsystemStatuses({ status }: { status: ClusterStatus }) {
  return (
    <Grid>
      {!status?.subsystems?.length && (
        <span style={{ fontStyle: 'italic' }}>
          No systems are reporting statuses
        </span>
      )}

      {status?.subsystems.map((subsystem, index) => {
        return (
          <GridItem key={subsystem.name} span={2}>
            <SubsystemDetails
            data-testid={`subsystem-details-${index}`}
              subsystem={subsystem}
            />
          </GridItem>
        )
      })}
    </Grid>
  );
}

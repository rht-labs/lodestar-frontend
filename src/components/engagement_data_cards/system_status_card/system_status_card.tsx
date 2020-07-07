import React from 'react';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { SubsystemDetails } from './subsystem_details';
import { Engagement } from '../../../schemas/engagement_schema';
import { SystemStatusDetailsModal } from './system_status_details_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';

export interface SystemStatusCardProps {
  currentEngagement: Engagement;
}
const SYSTEM_STATUS_MODAL_KEY = 'system_status';

export function SystemStatusCard({ currentEngagement }: SystemStatusCardProps) {
  const { status } = currentEngagement;
  const { requestOpen, activeModalKey } = useModalVisibility();
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
        <Grid>
          {status?.subsystems.map(subsystem => (
            <GridItem key={subsystem.name} span={2}>
              <SubsystemDetails subsystem={subsystem} />
            </GridItem>
          ))}
        </Grid>
      </DataCard>
    </>
  );
}

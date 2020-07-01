import React from 'react';
import {DataCard} from '../data_card';
import {Button, ButtonVariant, Grid, GridItem} from '@patternfly/react-core';
import {SubsystemDetails} from "./subsystem_details";
import {useEngagements} from "../../../context/engagement_context/engagement_hook";
import {Engagement} from "../../../schemas/engagement_schema";
import {SystemStatusDetailsModal} from "./system_status_details_modal";
import {useModalVisibility} from "../../../context/edit_modal_visibility_context/edit_modal_visibility_hook";
import {EditButton} from "../../data_card_edit_button/data_card_edit_button";

export interface SystemStatusCardProps{
  engagement: Engagement;
};
const SYSTEM_STATUS_MODAL_KEY = 'system_status';

export function SystemStatusCard({
  engagement,
}: SystemStatusCardProps) {
  const { activeEngagement: { status } = {} } = useEngagements();
  const { requestOpen, activeModalKey } = useModalVisibility();
  return (
    <>
      <SystemStatusDetailsModal
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
          {status?.subsystems.map( subsystem => (
            <GridItem span={2}>
              <SubsystemDetails
                subsystem={subsystem}
              />
            </GridItem>
          ))}
        </Grid>
      </DataCard>
    </>
  );
}
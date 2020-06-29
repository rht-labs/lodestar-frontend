import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Grid,
  GridItem,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from '@patternfly/react-core';
import { formatISO, isValid } from 'date-fns';

import {EditModalTemplate} from "../../../layout/edit_modal_template";
import {useModalVisibility} from "../../../context/edit_modal_visibility_context/edit_modal_visibility_hook";
import {Subsystem} from "../../../schemas/subsystem";
export interface SubsystemDetailsModalProps {
  isOpen: boolean;
  subsystem: Subsystem
}
export function SubsystemDetailsModal(
  props: SubsystemDetailsModalProps
) {
  const { requestClose } = useModalVisibility();

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={props.isOpen}
      onClose={requestClose}
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={requestClose}>Close</Button>
          </div>
        }
        title={props.subsystem.name}
      >
        <DetailedSubsystemStatusList subsystem={props.subsystem}/>
      </EditModalTemplate>
    </Modal>
  );
}

function DetailedSubsystemStatusList({ subsystem }: { subsystem: Subsystem }) {

  return (
    <Grid>
      <GridItem span={12}>
        <DataList aria-label="system status message" isCompact>
          <DataListItem aria-labelledby="system-status-messages">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="subsystemInfo" >
                    <b> Api: </b> {subsystem.api}
                  </DataListCell>,
                  <DataListCell key="subsystemInfo" >
                    <b> web_console: </b> {subsystem.web_console}
                  </DataListCell>,
                  <DataListCell key="subsystemInfo" >
                    <b> State: </b> {subsystem.state}
                  </DataListCell>,
                  <DataListCell key="subsystemInfo" >
                    <b> Status: </b> {subsystem.status}
                  </DataListCell>,
                  <DataListCell key="subsystemInfo" >
                    <b> Info: </b> {subsystem.info}
                  </DataListCell>,
                  <DataListCell key="subsystemMessage" >
                    <b> Messages: </b>
                    {subsystem.messages.map(m => <div>m.message</div>)}
                  </DataListCell>,
                  <DataListCell key="subsystemInfo" >
                    <b> Updated: </b> {subsystem.updated.toString()}
                    {!!subsystem.updated && isValid(subsystem.updated) ? formatISO(subsystem.updated) : ' - '}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        </DataList>
      </GridItem>
    </Grid>
  );
}

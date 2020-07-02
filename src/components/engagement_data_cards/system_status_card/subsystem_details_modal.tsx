import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Grid,
  GridItem,
  Title,
  TextContent,
} from '@patternfly/react-core';
import { Table, ICell, TableHeader, TableBody } from '@patternfly/react-table';
import { EditModalTemplate } from '../../../layout/edit_modal_template';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { Subsystem } from '../../../schemas/subsystem';
import { StatusIcon } from './status_icons';
import { getHumanReadableNameForHealthStatus } from '../../../schemas/cluster_status';
export interface SubsystemDetailsModalProps extends HasSubsystem {
  isOpen: boolean;
}

export interface HasSubsystem {
  subsystem: Subsystem;
}
export function SubsystemDetailsModal(props: SubsystemDetailsModalProps) {
  const { requestClose } = useModalVisibility();

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={props.subsystem.name === 'openshift'}
      onClose={requestClose}
      title={props.subsystem.name}
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={requestClose}>Close</Button>
          </div>
        }
      >
        <DetailedSubsystemStatusList subsystem={props.subsystem} />
      </EditModalTemplate>
    </Modal>
  );
}

function DetailedSubsystemStatusList({ subsystem }: { subsystem: Subsystem }) {
  return (
    <Grid>
      <GridItem span={12}>
        <DetailsSection title="Subsystem Status">
          <Grid>
            <GridItem span={12}>
              <HealthStatusWidget subsystem={subsystem} />
            </GridItem>
            <GridItem span={12}>
              <InfoWidget subsystem={subsystem} />
            </GridItem>
          </Grid>
        </DetailsSection>
      </GridItem>
      <GridItem span={12}>
        <DetailsSection title="Messages">
          <MessageWidget subsystem={subsystem} />
        </DetailsSection>
      </GridItem>
    </Grid>
  );
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: '1rem 0' }}>
      <TextContent>
        <div style={{ padding: '0 0 0.5rem 0' }}>
          <Title headingLevel="h3">{title}</Title>
        </div>
        <div>{children}</div>
      </TextContent>
    </div>
  );
}

function InfoWidget({ subsystem }: HasSubsystem) {
  if (!subsystem || !subsystem.info) {
    return <div />;
  }
  return (
    <div>
      <div>
        <span>
          <strong>Info:&nbsp;&nbsp;</strong>
          {subsystem.info}
        </span>
      </div>
      <div>
        <span>
          <strong>State:&nbsp;&nbsp;</strong>
          {subsystem.state}
        </span>
      </div>
    </div>
  );
}

function HealthStatusWidget({ subsystem }: HasSubsystem) {
  return (
    <span>
      <strong>Current Status:&nbsp;&nbsp;</strong>
      <StatusIcon status={subsystem.status} />
      &nbsp;&nbsp;
      <span>{getHumanReadableNameForHealthStatus(subsystem.status)}</span>
    </span>
  );
}

function MessageWidget({ subsystem }: HasSubsystem) {
  if (!subsystem || !subsystem.messages) {
    return <div />;
  }
  const columns: ICell[] = [{ title: 'Severity' }, { title: 'Message' }];
  const rows = subsystem.messages.map(message => [
    message.severity,
    message.message,
  ]);
  return (
    <Table cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
}

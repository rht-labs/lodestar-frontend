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
import { getHumanReadableSeverity } from '../../../schemas/system_message';
import { formatISO } from 'date-fns';
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
      isOpen={props.isOpen}
      onClose={requestClose}
      title={`${props.subsystem.name} Status`}
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
      <GridItem span={8}>
        <Grid>
          <GridItem span={12}>
            <HealthStatusWidget subsystem={subsystem} />
          </GridItem>
          <GridItem span={12}>
            <InfoWidget subsystem={subsystem} />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem span={4}>
        <AccessUrlWidget subsystem={subsystem} />
      </GridItem>
      <GridItem span={12}>
        <MessageWidget subsystem={subsystem} />
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
    </span>
  );
}

function MessageWidget({ subsystem }: HasSubsystem) {
  if (!subsystem || !subsystem.messages) {
    return <div />;
  }
  const columns: ICell[] = [
    { title: 'Severity' },
    { title: 'Message' },
    { title: 'Timestamp' },
  ];
  const rows = subsystem.messages.map(message => [
    getHumanReadableSeverity(message.severity),
    message.message,
    formatISO(message.updated),
  ]);
  return (
    <DetailsSection title="Messages">
      <Table cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    </DetailsSection>
  );
}

function AccessUrlWidget({ subsystem }: HasSubsystem) {
  if (!subsystem?.access_urls) {
    return <div />;
  }
  return (
    <DetailsSection title="Access Links">
      <ul>
        {subsystem?.access_urls
          ?.filter(accessLink => accessLink.url && accessLink.title)
          ?.map(accessLink => (
            <li>
              <a href={accessLink?.url}>{accessLink?.title}</a>
            </li>
          ))}
      </ul>
    </DetailsSection>
  );
}

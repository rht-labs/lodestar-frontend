import React from 'react';
import { Button, Flex, FlexItem, ButtonVariant } from '@patternfly/react-core';
import { StatusIcon } from './status_icons';
import { Subsystem } from '../../../schemas/subsystem';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { SubsystemDetailsModal } from './subsystem_details_modal';

export interface SubsystemDetailsProps {
  subsystem: Subsystem;
}

export function SubsystemDetails({ subsystem }: SubsystemDetailsProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  const SYSTEM_STATUS_MODAL_KEY = `subsystem-${subsystem.name}`;

  return (
    <>
      <SubsystemDetailsModal
        isOpen={activeModalKey?.includes(SYSTEM_STATUS_MODAL_KEY)}
        subsystem={subsystem}
      />
      <Flex>
        <FlexItem>
          <StatusIcon status={subsystem.status} />
        </FlexItem>
        <FlexItem>
          <Button
            data-testid="subsystem-item"
            variant={ButtonVariant.link}
            onClick={() => requestOpen(SYSTEM_STATUS_MODAL_KEY)}
          >
            {subsystem.name}
          </Button>
        </FlexItem>
      </Flex>
    </>
  );
}

import React from 'react';
import {Flex, FlexItem} from '@patternfly/react-core';
import {HealthStatus} from "../../../schemas/cluster_status";
import {StatusIcon} from "./status_icons";

export interface SubsystemDetailsProps {
  status: HealthStatus,
  title: string,
}

export function SubsystemDetails({
  status,
  title
}: SubsystemDetailsProps) {

  return (
    <>
      <Flex>
        <FlexItem>
          <StatusIcon status={status}/>
        </FlexItem>
        <FlexItem>
          {title}
        </FlexItem>
      </Flex>
    </>
  );
}

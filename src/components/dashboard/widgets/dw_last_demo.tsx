import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  TextContent,
  TextVariants,
  Text,
} from '@patternfly/react-core';
import {ReactComponent as BroadcastIcon} from '../../../assets/images/broadcast-tower.svg';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact, Engagement } from '../../../schemas/engagement';
import { LinkOrSpan } from '../../link_or_span/link_or_span';

export interface DwLastDemoProps {
  demos: Artifact[];
  engagements: Partial<Engagement>[];
}
const columns = ['Demo', 'Engagement'];
export function DwLastDemo({ demos = [], engagements = [] }: DwLastDemoProps) {
  const engagementsById = demos.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.engagement_uuid]: engagements.find(
        e => e.uuid === curr.engagement_uuid
      ),
    }),
    {}
  );
  const rows = demos.map(demo => {
    return [
      {
        title: (
          <LinkOrSpan href={demo.linkAddress}>{demo?.description}</LinkOrSpan>
        ),
      },
      {
        title: (
          <Link to={`/app/engagements/${demo.engagement_uuid}`}>
            {engagementsById[demo.engagement_uuid]?.customer_name}&nbsp;—&nbsp;
            {engagementsById[demo.engagement_uuid]?.project_name}
          </Link>
        ),
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
      <BroadcastIcon
          width="25"
          fill="#9400D3"
          stroke="#9400D3"
          style={{marginRight:"5px"}}
        ></BroadcastIcon>
        <TextContent>
          <Text component={TextVariants.h2}>Demos <span style={{fontSize:"12px", color:"#999999", verticalAlign:"middle"}}>(last 5)</span></Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Last 5 Demos"
          rows={rows}
          cells={columns}
          gridBreakPoint={'grid-lg'}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}

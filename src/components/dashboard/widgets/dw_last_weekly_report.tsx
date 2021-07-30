import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  TextContent,
  TextVariants,
  Text,
} from '@patternfly/react-core';
import {ReactComponent as HeartbeatIcon} from '../../../assets/images/heart-rate.svg';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact, Engagement } from '../../../schemas/engagement';
import { LinkOrSpan } from '../../link_or_span/link_or_span';

export interface DwLastWeeklyReportProps {
  artifacts: Artifact[];
  engagements: Partial<Engagement>[];
}
const columns = ['Weekly Report', 'Engagement'];
export function DwLastWeeklyReport({
  artifacts = [],
  engagements = [],
}: DwLastWeeklyReportProps) {
  const engagementsById = artifacts.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.engagement_uuid]: engagements.find(
        e => e.uuid === curr.engagement_uuid
      ),
    }),
    {}
  );
  const rows = artifacts.map(artifact => {
    return [
      {
        title: (
          <LinkOrSpan href={artifact?.linkAddress}>
            {artifact?.description}
          </LinkOrSpan>
        ),
      },
      {
        title: (
          <Link to={`/app/engagements/${artifact.engagement_uuid}`}>
            {engagementsById[artifact.engagement_uuid]?.customer_name}
            &nbsp;—&nbsp;
            {engagementsById[artifact.engagement_uuid]?.project_name}
          </Link>
        ),
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
      <HeartbeatIcon
          width="25"
          fill="#EE0000"
          stroke="#EE0000"
          style={{marginRight:"5px"}}
        ></HeartbeatIcon>
        <TextContent>
          <Text component={TextVariants.h2}>Weekly Reports <span style={{fontSize:"12px", color:"#999999", verticalAlign:"middle"}}>(last 5)</span></Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Last 5 Weekly Reports"
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

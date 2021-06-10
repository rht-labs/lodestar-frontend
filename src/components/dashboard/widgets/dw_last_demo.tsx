import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  TextContent,
  TextVariants,
  Text,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact, Engagement } from '../../../schemas/engagement';

export interface DwLastDemoProps {
  demos: Artifact[];
  engagements: Partial<Engagement>[];
}
const columns = ['Engagement', 'Demo'];
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
          <Link to={`/app/engagements/${demo.engagement_uuid}`}>
            {engagementsById[demo.engagement_uuid]?.customer_name}&nbsp;—&nbsp;
            {engagementsById[demo.engagement_uuid]?.project_name}
          </Link>
        ),
      },
      {
        title: demo?.description,
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h2}>Last 5 Demos</Text>
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

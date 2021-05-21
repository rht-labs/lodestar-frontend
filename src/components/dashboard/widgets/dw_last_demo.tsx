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
import { Artifact } from '../../../schemas/engagement';

export interface DwLastDemoProps {
  demos: Artifact[];
}
const columns = ['Demo'];
export function DwLastDemo({ demos }: DwLastDemoProps) {
  const rows = demos.map(demo => {
    return [
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

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

export interface DwLastWeeklyReportProps {
  artifacts: Artifact[];
}
const columns = ['Weekly Report'];
export function DwLastWeeklyReport({ artifacts }: DwLastWeeklyReportProps) {
  const rows = artifacts.map(artifact => {
    return [
      {
        title: artifact?.description,
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h2}>Last 5 Weekly Reports</Text>
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

import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Artifact } from '../../../schemas/engagement';
export interface DwLastArtifactsProps {
  artifacts: Artifact[];
}
const columns = ['Artifacts', 'Type'];
export const DwLastArtifacts = (props: DwLastArtifactsProps) => {
  const rows = props.artifacts.map(artifact => {
    return [
      {
        title: artifact?.description,
      },
      artifact?.type,
    ];
  });
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h2}>Last 5 Artifacts</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Last 5 Artifacts"
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
};

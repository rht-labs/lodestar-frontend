import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { Table, TableBody } from '@patternfly/react-table';
import React from 'react';
import { Engagement } from '../../../schemas/engagement';

export interface DwLastUpdatedProps {
  engagements: Partial<Engagement>[];
}
const columns = ['Hello', 'World!'];
export const DwLastUpdated = (props: DwLastUpdatedProps) => {
  const rows = props.engagements.map(e => [e.customer_name, e.project_name]);
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h2}>Recently Updated Engagements</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Recently updated engagements"
          rows={rows}
          cells={columns}
        >
          <TableBody />
        </Table>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

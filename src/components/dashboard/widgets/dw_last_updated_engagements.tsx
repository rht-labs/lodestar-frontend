import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { formatRelative } from 'date-fns';
import React from 'react';
import { Engagement } from '../../../schemas/engagement';

export interface DwLastUpdatedProps {
  engagements: Partial<Engagement>[];
  onClick?(customerName: string, projectName: string): void;
}
const columns = ['Customer Name', 'Project Name', 'Last Update'];
export const DwLastUpdated = (props: DwLastUpdatedProps) => {
  const rows = props.engagements.map(e => {
    let relativeDate = formatRelative(e.last_update, new Date());
    relativeDate = relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);
    return [
      e.customer_name,
      {
        title: (
          <Button
            onClick={() => props.onClick?.(e.customer_name, e.project_name)}
            variant={ButtonVariant.link}
          >
            {e.project_name}
          </Button>
        ),
      },
      {
        title: relativeDate,
      },
    ];
  });
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
          <TableHeader />
          <TableBody />
        </Table>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

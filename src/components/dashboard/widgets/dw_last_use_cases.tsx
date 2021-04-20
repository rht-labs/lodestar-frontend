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
import { EngagementUseCase } from '../../../schemas/engagement';
export interface DwLastUseCasesProps {
  useCases: EngagementUseCase[];
}
const columns = ['Use Case'];
export const DwLastUseCases = (props: DwLastUseCasesProps) => {
  const rows = props.useCases.map(useCase => {
    return [
      {
        title: useCase?.description,
        // <Button variant={ButtonVariant.link} onClick={() => {}} isInline>
        //   {useCase?.description}
        // </Button>
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h2}>Last 5 Use Cases</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Last 5 Use Cases"
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

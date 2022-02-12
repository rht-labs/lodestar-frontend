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
import { ReactComponent as AtomIcon } from '../../../assets/images/atom-alt.svg';
import {
  cellWidth,
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table';
import { EngagementUseCase } from '../../../schemas/engagement';
import CustomRowWrapper from '../../../components/custom_row_wrapper/custom_row_wrapper';
import { Link } from 'react-router-dom';
export interface DwLastUseCasesProps {
  useCases: EngagementUseCase[];
}
const columns = [
  'Use Cases',
];
export const DwLastUseCases = (props: DwLastUseCasesProps) => {
  const rows = props.useCases.map(useCase => {
    return [
      {
        title: <div><div><b>Engagement:</b> <Link to={`/app/engagements/${useCase.engagement_uuid}`}>{ useCase?.customer_name + ' - ' + useCase?.project_name }</Link></div><div>{useCase ?.description}</div></div>,
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
        <AtomIcon
          width="25"
          fill="#EC7A0A"
          stroke="#EC7A0A"
          style={{ marginRight: '5px' }}
        ></AtomIcon>
        <TextContent>
          <Text component={TextVariants.h2}>
            Use Cases{' '}
            <span
              style={{
                fontSize: '12px',
                color: '#999999',
                verticalAlign: 'middle',
              }}
            >
              (last 5)
            </span>
          </Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Last 5 Use Cases"
          rows={rows}
          cells={columns}
          gridBreakPoint={'grid-lg'}
          rowWrapper={({ trRef, rowProps, ...props }) => (
            <CustomRowWrapper trref={trRef} rowprops={rowProps} {...props} />
          )}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

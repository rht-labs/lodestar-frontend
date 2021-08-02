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
import {ReactComponent as HandshakeIcon} from '../../../assets/images/handshake-alt.svg';
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
            isInline
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
  const customRowWrapper = ({ trRef, className, rowProps, row: { isExpanded, isHeightAuto }, ...props }) => {
    const isOddRow = (rowProps.rowIndex + 1) % 2;
    const customStyle = {
      backgroundColor: 'rgba(0, 102, 205, 0.03)'
    };
    return (
      <tr
        {...props}
        ref={trRef}
        hidden={isExpanded !== undefined && !isExpanded}
        style={isOddRow ? customStyle : { }}
      />
    );
  };
  return (
    <Card>
      <CardHeader>
      <HandshakeIcon
          width="25"
          fill="#0066CC"
          stroke="#0066CC"
          style={{marginRight:"5px"}}
        ></HandshakeIcon>
        <TextContent>
          <Text component={TextVariants.h2}>Recently Updated Engagements <span style={{fontSize:"12px", color:"#999999", verticalAlign:"middle"}}>(last 5)</span></Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Recently updated engagements"
          rows={rows}
          cells={columns}
          gridBreakPoint={'grid-lg'}
          rowWrapper={customRowWrapper}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

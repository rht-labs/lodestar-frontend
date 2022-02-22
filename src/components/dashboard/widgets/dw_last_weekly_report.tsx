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
import { Artifact } from '../../../schemas/engagement';
import { LinkOrSpan } from '../../link_or_span/link_or_span';
import CustomRowWrapper from '../../../components/custom_row_wrapper/custom_row_wrapper';

export interface DwLastWeeklyReportProps {
  artifacts: Artifact[];
}
const columns = ['Weekly Report', 'Engagement'];
export function DwLastWeeklyReport({
  artifacts = [],
}: DwLastWeeklyReportProps) {
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
            {artifact?.customer_name}
            &nbsp;—&nbsp;
            {artifact?.project_name}
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
          rowWrapper={({trRef, rowProps, ...props}) => <CustomRowWrapper trref={trRef} rowprops={rowProps} {...props}/>}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}

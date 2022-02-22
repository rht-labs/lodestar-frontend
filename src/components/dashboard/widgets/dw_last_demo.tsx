import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  TextContent,
  TextVariants,
  Text,
} from '@patternfly/react-core';
import {ReactComponent as BroadcastIcon} from '../../../assets/images/broadcast-tower.svg';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact } from '../../../schemas/engagement';
import { LinkOrSpan } from '../../link_or_span/link_or_span';
import CustomRowWrapper from '../../../components/custom_row_wrapper/custom_row_wrapper';
export interface DwLastDemoProps {
  demos: Artifact[];
}
const columns = ['Demo', 'Engagement'];
export function DwLastDemo({ demos = [] }: DwLastDemoProps) {
  const rows = demos.map(demo => {
    return [
      {
        title: (
          <LinkOrSpan href={demo.linkAddress}>{demo?.description}</LinkOrSpan>
        ),
      },
      {
        title: (
          <Link to={`/app/engagements/${demo.engagement_uuid}`}>
            {demo?.customer_name}&nbsp;—&nbsp;{demo?.project_name}
          </Link>
        ),
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
      <BroadcastIcon
          width="25"
          fill="#9400D3"
          stroke="#9400D3"
          style={{marginRight:"5px"}}
        ></BroadcastIcon>
        <TextContent>
          <Text component={TextVariants.h2}>Demos <span style={{fontSize:"12px", color:"#999999", verticalAlign:"middle"}}>(last 5)</span></Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Last 5 Demos"
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

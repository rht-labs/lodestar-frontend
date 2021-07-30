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
import {ReactComponent as CubesIcon} from '../../../assets/images/cubes.svg';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Artifact, Engagement } from '../../../schemas/engagement';
import { LinkOrSpan } from '../../link_or_span/link_or_span';
import { Link } from 'react-router-dom';
export interface DwLastArtifactsProps {
  artifacts: Artifact[];
  engagements: Partial<Engagement>[];
}
const columns = ['Artifact', 'Type', 'Engagement'];
export const DwLastArtifacts = ({
  artifacts = [],
  engagements = [],
}: DwLastArtifactsProps) => {
  const engagementsById = artifacts.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.engagement_uuid]: engagements.find(
        e => e.uuid === curr.engagement_uuid
      ),
    }),
    {}
  );
  const rows = artifacts.map(artifact => {
    return [
      {
        title: (
          <LinkOrSpan href={artifact.linkAddress}>
            {artifact?.description}
          </LinkOrSpan>
        ),
      },
      artifact?.type,
      {
        title: (
          <Link to={`/app/engagements/${artifact.engagement_uuid}#artifacts`}>
            {engagementsById[artifact.engagement_uuid]?.customer_name +
              ' — ' +
              engagementsById[artifact.engagement_uuid]?.project_name}
          </Link>
        ),
      },
    ];
  });
  return (
    <Card>
      <CardHeader>
        <CubesIcon
          width="25"
          fill="#4CB140"
          stroke="#4CB140"
          style={{marginRight:"5px"}}
        ></CubesIcon>
        <TextContent>
          <Text component={TextVariants.h2}>Artifacts <span style={{fontSize:"12px", color:"#999999", verticalAlign:"middle"}}>(last 5)</span></Text>
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

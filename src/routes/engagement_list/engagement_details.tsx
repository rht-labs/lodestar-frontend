import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { differenceInWeeks, format as formatDate, isValid } from 'date-fns';
import {
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import {
  ClipboardCheckIcon,
  CodeBranchIcon,
  CubeIcon,
  OutlinedClockIcon,
  UserIcon,
} from '@patternfly/react-icons';

function getStatusColor(status?: string) {
  switch (status) {
    case 'upcoming': {
      return '#FF4500';
    }
    case 'active': {
      return '#228B22';
    }
    default: {
      return '#C0C0C0';
    }
  }
}

function FirstLine({
  status,
  startDate,
}: {
  status?: string;
  startDate?: Date;
}) {

  if (status === 'upcoming') {
    return (
      <div data-testid="upcomingEngagement">
        <Grid hasGutter>
          <GridItem span={12}>
            Created by:
            <Link to="#"> Takeshi.K </Link>
          </GridItem>
          <GridItem>
            Target start date:{' '}
            {!!startDate && isValid(startDate)
              ? formatDate(startDate, 'MMM dd, yyyy')
              : 'TBA'}
          </GridItem>
        </Grid>
      </div>
    );
  } else {
    return (
      <div data-testid="activeOrPastEngagement">
        The link to the last demo:
        <Link to="#"> https://pf4.345jdhgksdf.org </Link>
      </div>
    );
  }
}

export function EngagementDetails({
  engagement,
  status,
}: {
  engagement?: Engagement;
  status?: string;
}) {
  return (
    <>
      <Grid hasGutter>
        <GridItem span={12}>
          <FirstLine status={status} startDate={engagement?.start_date} />
        </GridItem>
        <GridItem span={6}>
          <Flex>
            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <Tooltip
                  position={TooltipPosition.bottom}
                  content={'Number of people in this engagement'}
                >
                  <UserIcon />
                </Tooltip>
              </FlexItem>
              <FlexItem>{engagement?.engagement_users?.length || 0}</FlexItem>
            </Flex>

            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <Tooltip
                  position={TooltipPosition.bottom}
                  content={'Number of weeks for this engagement'}
                >
                  <OutlinedClockIcon />
                </Tooltip>
              </FlexItem>
              <FlexItem>
                <DurationInWeeks
                  startDate={engagement?.start_date}
                  endDate={engagement?.end_date}/>
              </FlexItem>
            </Flex>

            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <Tooltip
                  position={TooltipPosition.bottom}
                  content={'Number of available reports'}
                >
                  <ClipboardCheckIcon />
                </Tooltip>
              </FlexItem>
              <FlexItem>-</FlexItem>
            </Flex>

            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <Tooltip
                  position={TooltipPosition.bottom}
                  content={'Number of commits'}
                >
                  <CodeBranchIcon />
                </Tooltip>
              </FlexItem>
              <FlexItem>-</FlexItem>
            </Flex>

            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <Tooltip
                  position={TooltipPosition.bottom}
                  content={'Number of repositories'}
                >
                  <CubeIcon />
                </Tooltip>
              </FlexItem>
              <FlexItem>-</FlexItem>
            </Flex>
            <Flex>
              <FlexItem>
                <b style={{ color: getStatusColor(status) }}>
                  {status?.toString().toUpperCase()}
                </b>
              </FlexItem>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem span={6}>
          Updated 2 days ago: Section <b>Users</b>
        </GridItem>
      </Grid>
    </>
  );
}

function DurationInWeeks({ startDate, endDate}: { startDate?: Date; endDate?: Date}) {
    if (!!startDate && isValid(startDate) && !!endDate && isValid(endDate)) {
      return <>{differenceInWeeks(endDate, startDate)}</>
    }
    else return <>0</>;
}
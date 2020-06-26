import React from 'react';
import { Engagement, EngagementStatus } from '../../schemas/engagement_schema';
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
import { ActivityHistoryLineItem } from '../../components/activity_history_line_item/activity_history_line_item';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../../components/feature';

function FirstLine({
  status,
  startDate,
  createdBy,
}: {
  status?: EngagementStatus;
  startDate?: Date;
  createdBy?: string;
}) {
  if (status === EngagementStatus.upcoming) {
    return (
      <div data-testid="upcomingEngagement">
        <Grid hasGutter>
          <GridItem span={12}>
            Created by:
            <Link to="#">{!!createdBy ? ' ' + createdBy : 'TBA'}</Link>
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

function DurationInWeeks({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  if (!!startDate && isValid(startDate) && !!endDate && isValid(endDate)) {
    return <>{differenceInWeeks(endDate, startDate)}</>;
  } else return <>0</>;
}

export function EngagementDetails({
  engagement,
  status,
}: {
  engagement?: Engagement;
  status?: EngagementStatus;
}) {
  return (
    <>
      <Grid hasGutter>
        <GridItem span={12}>
          <FirstLine
            status={status}
            startDate={engagement?.start_date}
            createdBy={engagement?.created_by_user}
          />
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
                  endDate={engagement?.end_date}
                />
              </FlexItem>
            </Flex>
            <Feature name={APP_FEATURES.engagementCardIcons}>
              <>
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
              </>
            </Feature>
            <Flex>
              <FlexItem>
                <EngagementStatusText status={status} />
              </FlexItem>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem span={6}>
          <ActivityHistoryLineItem commit={engagement?.commits?.[0]} />
        </GridItem>
      </Grid>
    </>
  );
}

const EngagementStatusText = ({ status }: { status: EngagementStatus }) => {
  const getEngagementStatusText = () => {
    if (status === EngagementStatus.active) {
      return 'Active';
    } else if (status === EngagementStatus.upcoming) {
      return 'Upcoming';
    } else if (status === EngagementStatus.past) {
      return 'Past';
    }
    return '';
  };
  const getStatusColor = (status?: EngagementStatus) => {
    switch (status) {
      case EngagementStatus.upcoming: {
        return '#EC7A08';
      }
      case EngagementStatus.active: {
        return '#6CA100';
      }
      default: {
        return '#B8BBBE';
      }
    }
  };
  return (
    <b style={{ color: getStatusColor(status) }}>
      {getEngagementStatusText().toUpperCase()}
    </b>
  );
};

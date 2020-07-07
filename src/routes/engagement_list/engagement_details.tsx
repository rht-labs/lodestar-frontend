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
import { EngagementStatusText } from "./engagement_status_text";
import { DisplayCreatedByName } from "../../common/display_created_by_name";

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
          <Grid hasGutter>
            <GridItem span={12}>
              {'Created by: '}
              <DisplayCreatedByName
                userFromServer={engagement?.creation_details?.created_by_user}
                lastUpdatedBy={engagement?.last_update_by_name}/>
            </GridItem>
            <GridItem>
              Target start date:{' '}
              {!!engagement?.start_date && isValid(engagement?.start_date)
                ? formatDate(engagement?.start_date, 'MMM dd, yyyy')
                : 'TBA'}
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem span={6}>
          <Flex>
            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <Tooltip
                  position={TooltipPosition.bottom}
                  entryDelay={0}
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
                  entryDelay={0}
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
                      entryDelay={0}
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
                      entryDelay={0}
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
                      entryDelay={0}
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



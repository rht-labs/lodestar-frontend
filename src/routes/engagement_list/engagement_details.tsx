import React from 'react';
import {Engagement} from '../../schemas/engagement_schema';
import {
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import {Link} from 'react-router-dom';
import {
  ClipboardCheckIcon,
  CodeBranchIcon,
  CubeIcon,
  OutlinedClockIcon,
  UserIcon} from '@patternfly/react-icons';


function calculateDuration(startDate?: Date, endDate?: Date){

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  if (startDate && endDate) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.ceil((utc2 - utc1) / (MILLISECONDS_PER_DAY * 7));
  }
  else return 0;
}

function getStatusColor(status?: string) {
  switch(status){
    case "upcoming":{
      return "#FF4500";
    }
    case "active":{
      return "#228B22";
    }
    default:{
      return "#C0C0C0";
    }
  }
}

function renderFirstLine(status?: string, startDate?: Date)  {
  if (status === 'upcoming') {
    return (
      <div>
        <Grid hasGutter>
          <GridItem span={12}>
            Created by:
            <Link to='#'> Takeshi.K </Link>
          </GridItem>
          <GridItem>
            Target start date: { startDate ? startDate.toDateString() : 'TBA' }
          </GridItem>
        </Grid>
      </div>)
  } else {
    return (
      <div>
        The link to the last demo:
        <Link to='#'> https://pf4.345jdhgksdf.org </Link>
      </div> )}
}

export function EngagementDetails(
  {engagement, status}: { engagement?: Engagement; status?: string}) {

  return <>
    <Grid hasGutter>
      <GridItem span={12}>
        { renderFirstLine(status, engagement?.start_date) }
      </GridItem>
      <GridItem span={6}>
        <Flex>
          <Flex>
            <FlexItem spacer={{default: 'spacerSm'}}>
              <Tooltip
                position={TooltipPosition.bottom}
                content={ 'Number of people in this engagement' }>
              <UserIcon/>
              </Tooltip>
            </FlexItem>
            <FlexItem>
              {engagement?.engagement_users?.length || 0}
            </FlexItem>
          </Flex>

          <Flex>
            <FlexItem spacer={{default: 'spacerSm'}}>
              <Tooltip
                position={TooltipPosition.bottom}
                content={ 'Number of weeks for this engagement' }>
                <OutlinedClockIcon/>
              </Tooltip>
            </FlexItem>
            <FlexItem>
              { calculateDuration(engagement?.start_date, engagement?.end_date) }
            </FlexItem>
          </Flex>

          <Flex>
            <FlexItem spacer={{default: 'spacerSm'}}>
              <Tooltip
                position={TooltipPosition.bottom}
                content={ 'Number of available reports' }>
                <ClipboardCheckIcon/>
              </Tooltip>
            </FlexItem>
            <FlexItem>
              -
            </FlexItem>
          </Flex>

          <Flex>
            <FlexItem spacer={{default: 'spacerSm'}}>
              <Tooltip
                position={TooltipPosition.bottom}
                content={ 'Number of commits' }>
                <CodeBranchIcon/>
              </Tooltip>
            </FlexItem>
            <FlexItem>
              -
            </FlexItem>
          </Flex>

          <Flex>
            <FlexItem spacer={{default: 'spacerSm'}}>
              <Tooltip
                position={TooltipPosition.bottom}
                content={ 'Number of repositories' }>
                <CubeIcon/>
              </Tooltip>
            </FlexItem>
            <FlexItem>
              -
            </FlexItem>
          </Flex>
          <Flex>
            <FlexItem>
              <b style={{color: getStatusColor(status)}}>
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
  </>;
}

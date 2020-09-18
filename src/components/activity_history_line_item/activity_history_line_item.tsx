import React from 'react';
import { differenceInDays } from 'date-fns';
import { GitCommit } from '../../schemas/git_commit';
import {
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Flex,
  FlexItem,
} from '@patternfly/react-core';

export interface ActivityHistoryLineItemProps {
  commit: GitCommit;
  onToggle?: (gitCommitId: string) => void;
  isAccordionItem?: boolean;
  isExpanded?: boolean;
}
export function ActivityHistoryLineItem({
  commit,
  isExpanded = false,
  isAccordionItem = false,
  onToggle = () => {},
}: ActivityHistoryLineItemProps) {
  const difference = differenceInDays(new Date(), commit?.committed_date);
  let dateText = '';
  if (difference) {
    dateText = `${difference} day${difference > 1 ? 's' : ''} ago`;
  } else {
    dateText = 'today';
  }
  if (!commit) {
    return <div />;
  }

  if (isAccordionItem) {
    return (
      <ActivityHistoryAccordionItem
        isExpanded={isExpanded}
        onToggle={onToggle}
        commit={commit}
      />
    );
  }
  return (
    <p>
      <span>Updated by&nbsp;</span>
      <b>{commit.author_name}&nbsp;</b>
      <b>{dateText}</b>
    </p>
  );
}

function ActivityHistoryAccordionItem({
  commit,
  onToggle,
  isExpanded,
}: ActivityHistoryLineItemProps) {
  return (
    <AccordionItem>
      <AccordionToggle
        onClick={() => onToggle(commit.id)}
        id={commit.id}
        isExpanded={isExpanded}
        component="div"
      >
        <Flex>
          <FlexItem flex={{ default: 'flex_1' }}>
            <span>{commit.committed_date.toLocaleString()}</span>
          </FlexItem>
          <FlexItem>
            {commit.author_name}&nbsp;{commit.author_email}
          </FlexItem>
          <FlexItem>
            <span style={{ minWidth: '50%' }}>{commit.message}</span>
          </FlexItem>
        </Flex>
      </AccordionToggle>
      <AccordionContent isHidden={!isExpanded}>
        <CommitData commit={commit} />
      </AccordionContent>
    </AccordionItem>
  );
}

function CommitData({ commit }: { commit: GitCommit }) {
  return (
    <DataList aria-label="commit details">
      <DataListItem aria-labelledby="weburl">
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell>
                <b id="weburl">Commit Url</b>
              </DataListCell>,
              <DataListCell>
                <a href={commit.web_url}>{commit.web_url}</a>
              </DataListCell>,
            ]}
          />
        </DataListItemRow>
      </DataListItem>
    </DataList>
  );
}

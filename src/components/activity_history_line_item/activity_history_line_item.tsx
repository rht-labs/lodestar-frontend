import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { differenceInDays } from 'date-fns';
import { GitCommit } from '../../schemas/git_commit';
import {
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { format as formatDate } from 'date-fns';

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
const timeString = (date: Date): string => {
  return formatDate(date, "d MMM  y, HH:mm 'UTC'X");
};

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
          <FlexItem>
            <span>{timeString(commit.committed_date)}</span>
          </FlexItem>
          <FlexItem>
            <span>{commit.message.split('\n')[0]}</span>
          </FlexItem>
          <FlexItem>{commit.author_name}</FlexItem>
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
    <div>
      <div>
        <span style={{ whiteSpace: 'pre-wrap' }}>{commit.message}</span>
      </div>
      <div>
        <a href={commit.web_url} target="_blank" rel="noopener noreferrer" className="nowrap">See in GitLab&nbsp;&nbsp;<ExternalLinkAltIcon className="externalAltLinkIcon"/></a>
      </div>
    </div>
  );
}

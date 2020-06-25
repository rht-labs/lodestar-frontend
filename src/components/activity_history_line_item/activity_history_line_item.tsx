import React from 'react';
import { differenceInDays } from 'date-fns';
import { GitCommit } from '../../schemas/git_commit';

export function ActivityHistoryLineItem({ commit }: { commit: GitCommit }) {
  const difference = differenceInDays(new Date(), commit?.committed_date);
  let dateText = '';
  if (difference) {
    dateText = `${difference} days ago`;
  } else {
    dateText = 'today';
  }
  return (
    <p>
      <span>Updated by&nbsp;</span>
      <b>{commit.author_name}&nbsp;</b>
      <b>{dateText}</b>
    </p>
  );
}

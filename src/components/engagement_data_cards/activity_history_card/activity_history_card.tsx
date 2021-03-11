import React, { useState } from 'react';
import { DataCard } from '../data_card';
import { Grid, GridItem, Accordion } from '@patternfly/react-core';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { GitCommit } from '../../../schemas/git_commit';
import { ActivityHistoryLineItem } from '../../activity_history_line_item/activity_history_line_item';
import { ActivityHistoryDetailsModal } from '../../engagement_edit_modals/activity_history_details_modal';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { useEngagement } from '../../../context/engagement_context/engagement_hook';

const ACTIVITY_HISTORY_MODAL_KEY = 'activity_history';

export function ActivityHistoryCard() {
  const { requestOpen, activeModalKey } = useModalVisibility();
  const { currentEngagement: engagement } = useEngagement();
  const commits = engagement?.commits ?? [];
  return (
    <>
      <ActivityHistoryDetailsModal
        engagement={engagement}
        isOpen={activeModalKey?.includes(ACTIVITY_HISTORY_MODAL_KEY)}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(ACTIVITY_HISTORY_MODAL_KEY)}
            text={'View More'}
          />
        )}
        title="Activity History"
      >
        <Grid hasGutter>
          <GridItem span={12}>
            <ActivityList
              commits={commits?.slice(
                0,
                commits?.length > 3 ? 3 : commits?.length
              )}
            />
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}

function ActivityList({ commits }: { commits: GitCommit[] }) {
  const anyActivities = commits?.length > 0;
  const [expandedItems, _setExpandedItems] = useState<string[]>([]);
  const toggleItem = (commitId: string) => {
    if (expandedItems.includes(commitId)) {
      const expandedItemsClone = [...expandedItems];
      expandedItemsClone.splice(expandedItemsClone.indexOf(commitId), 1);
      _setExpandedItems(expandedItemsClone);
    } else {
      _setExpandedItems([...expandedItems, commitId]);
    }
  };
  if (anyActivities) {
    return (
      <div>
        <Accordion asDefinitionList={false}>
          {commits.map((commit: GitCommit) => {
            if (!commit) {
              return <div />;
            } else {
              return (
                <ActivityHistoryLineItem
                  key={commit.id}
                  isExpanded={expandedItems.includes(commit.id)}
                  isAccordionItem={true}
                  onToggle={toggleItem}
                  commit={commit}
                />
              );
            }
          })}
        </Accordion>
      </div>
    );
  }
  return <p style={{ fontStyle: 'italic' }}> No activity to display</p>;
}

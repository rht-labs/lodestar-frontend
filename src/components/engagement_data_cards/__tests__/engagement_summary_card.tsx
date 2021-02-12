import React from 'react';
import { act, render, RenderResult } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';
import { Engagement } from '../../../schemas/engagement';
import { EngagementSummaryCard } from '../engagement_summary_card/engagement_summary_card';

describe('Engagement Summary Card', () => {
  const getView = (engagement?: Engagement) =>
    render(
      <TestStateWrapper>
        <EngagementContext.Provider
          value={
            engagement
              ? engagement
              : {
                  currentEngagement: {
                    ...Engagement.fromFake(true),
                    timezone: 'America/Los_Angeles',
                  },
                }
          }
        >
          <EngagementSummaryCard></EngagementSummaryCard>
        </EngagementContext.Provider>
      </TestStateWrapper>
    );

  test('Engagement summary card shows timezone label for the given timezone code', async () => {
    let view: RenderResult;
    await act(async () => {
      view = getView();
    });
    expect(await view.findByTestId('timezone_label')).toBeDefined();
    expect(
      await view.findByText('America/Los_Angeles (GMT-08:00)')
    ).toBeDefined();
  });
});

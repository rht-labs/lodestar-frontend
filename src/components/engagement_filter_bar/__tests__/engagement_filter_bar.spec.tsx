import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import { EngagementFilterBar } from '../engagement_filter_bar';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';
import { EngagementFormConfig } from '../../../schemas/engagement_config';

const getById = queryByAttribute.bind(null, 'id');

describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <EngagementContext.Provider
          value={
            {
              engagementFormConfig: EngagementFormConfig.fromFake(),
            } as IEngagementContext
          }
        >
          <EngagementFilterBar filter={{}} onChange={() => {}} />
        </EngagementContext.Provider>
      )
    ).toMatchSnapshot();
  });
  test('can find engagement region filter select', async () => {
    const wrapper = render(
      <EngagementContext.Provider
        value={
          {
            engagementFormConfig: EngagementFormConfig.fromFake(),
          } as IEngagementContext
        }
      >
        <EngagementFilterBar filter={{}} onChange={() => {}} />
      </EngagementContext.Provider>
    );
    expect(getById(wrapper.container, 'region_dropdown')).not.toBeNull();
  });
});

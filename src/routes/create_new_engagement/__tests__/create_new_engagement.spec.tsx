import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';
import { act, fireEvent, render } from '@testing-library/react';

import { APP_FEATURES } from '../../../common/app_features';
import { CreateNewEngagement } from '../create_new_engagement';
import { Engagement } from '../../../schemas/engagement';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { getById } from '../../../utilities/get_by_id';
import { mockEngagementFormConfig } from '../../../mocks/engagement_form_config_mocks';

describe('Create New Engagement Route', () => {
  const getComponent = () => {
    return (
      <MemoryRouter>
        <TestStateWrapper>
          <CreateNewEngagement />
        </TestStateWrapper>
      </MemoryRouter>
    );
  };
  test('should have a field for a project name', async () => {
    act(async () => {
      const wrapper = render(getComponent());
      expect(wrapper.getByTestId('project-name')).toBeDefined();
    });
  });
  test('should have a field for a customer name', async () => {
    act(async () => {
      const wrapper = render(getComponent());
      expect(wrapper.getByTestId('customer-name')).toBeDefined();
    });
  });
  test('should have a field for a region name', async () => {
    act(async () => {
      const wrapper = render(getComponent());
      expect(wrapper.getByTestId('region')).toBeDefined();
    });
  });
  test('clicking the submit button creates a new engagement', async () => {
    const createEngagement = jest.fn();
    const e = Engagement.fromFake();
    e.customer_name = 'a';
    const Component = () => (
      <MemoryRouter>
        <EngagementContext.Provider
          value={
            ({
              engagements: [e],
              getEngagements: async () => [],
              createEngagement,
              engagementFormConfig: mockEngagementFormConfig(),
            } as unknown) as IEngagementContext
          }
        >
          <FeatureToggles features={[APP_FEATURES.writer, APP_FEATURES.reader]}>
            <CreateNewEngagement />
          </FeatureToggles>
        </EngagementContext.Provider>
      </MemoryRouter>
    );

    act(async () => {
      const wrapper = render(<Component />);
      const customerNameField = wrapper
        .getByTestId('customer-name')
        .getElementsByTagName('input')[0];
      fireEvent.change(customerNameField, {
        target: { value: 'a' },
      });
      const dropdownButton = getById(wrapper.container, 'customer_dropdown');
      fireEvent.click(dropdownButton);
      wrapper.rerender(<Component />);
      fireEvent.click(wrapper.getByTestId('a'));
      fireEvent.change(wrapper.getByTestId('project-name'), {
        target: { value: 'Mars Rover' },
      });
      fireEvent.change(wrapper.getByTestId('region'), {
        target: { value: 'dev-1' },
      });

      wrapper.rerender(<Component />);

      const createButton = wrapper.getByTestId('create-engagement-button');
      fireEvent.click(createButton);
      expect(createEngagement).toHaveBeenCalledWith({
        customer_name: 'a',
        engagement_region: 'dev-1',
        engagement_type: 'Residency',
        project_name: 'Mars Rover',
      });
    });
  });
});

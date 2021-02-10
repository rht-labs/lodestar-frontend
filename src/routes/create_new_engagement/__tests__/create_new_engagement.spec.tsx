import React from 'react';
import { CreateNewEngagement } from '../create_new_engagement';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import {
  render,
  act,
  fireEvent,
  queryByAttribute,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { APP_FEATURES } from '../../../common/app_features';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { IAuthContext } from '../../../context/auth_context/auth_context';
import { Engagement } from '../../../schemas/engagement';
import { IVersionContext } from '../../../context/version_context/version_context';
const getById = queryByAttribute.bind(null, 'id');

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
  test('should match snapshot', async () => {
    await act(async () => {
      const rendered = render(getComponent());
      expect(rendered).toMatchSnapshot();
    });
  });
  test('should have a field for a project name', async () => {
    await act(async () => {
      const wrapper = render(getComponent());
      expect(wrapper.getByTestId('project-name')).toBeDefined();
    });
  });
  test('should have a field for a customer name', async () => {
    await act(async () => {
      const wrapper = render(getComponent());
      expect(wrapper.getByTestId('customer-name')).toBeDefined();
    });
  });
  test('should have a field for a region name', async () => {
    await act(async () => {
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
              engagementFormConfig: EngagementFormConfig.fromFake(),
            } as unknown) as IEngagementContext
          }
        >
          <FeatureToggles
            authContext={{} as IAuthContext}
            versionContext={{} as IVersionContext}
            features={[APP_FEATURES.writer, APP_FEATURES.reader]}
          >
            <CreateNewEngagement />
          </FeatureToggles>
        </EngagementContext.Provider>
      </MemoryRouter>
    );

    await act(async () => {
      const wrapper = render(<Component />);
      const customerNameField = wrapper
        .getByTestId('customer-name')
        .getElementsByTagName('input')[0];
      await fireEvent.change(customerNameField, {
        target: { value: 'a' },
      });
      const dropdownButton = getById(wrapper.container, 'customer_dropdown');
      fireEvent.click(dropdownButton);
      wrapper.rerender(<Component />);
      await fireEvent.click(wrapper.getByTestId('a'));
      await fireEvent.change(wrapper.getByTestId('project-name'), {
        target: { value: 'Mars Rover' },
      });
      await fireEvent.change(wrapper.getByTestId('region'), {
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

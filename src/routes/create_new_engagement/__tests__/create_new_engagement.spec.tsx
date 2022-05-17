import { act, fireEvent, render } from '@testing-library/react';

import { APP_FEATURES } from '../../../common/app_features';
import { CreateNewEngagement } from '../create_new_engagement';
import { Engagement } from '../../../schemas/engagement';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { FakedEngagementService } from '../../../services/engagement_service/implementations/faked_engagement_service';

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
    const wrapper = render(getComponent());
    const projectName = wrapper.getByTestId('project-name');

    await act(async () => {
      fireEvent.change(projectName, { target: { value: '123' } })
    });

    expect(projectName).toHaveValue('123');

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
    const e = Engagement.fromFake();
    e.customer_name = 'banana';

    const fakey = new FakedEngagementService(true);

    const getWriterComponent = () => {
      return (
        <MemoryRouter>
          <TestStateWrapper spyedEngagementService={fakey}>
           <FeatureToggles features={[APP_FEATURES.writer, APP_FEATURES.reader]}>
            <CreateNewEngagement />
            </FeatureToggles>
          </TestStateWrapper>
        </MemoryRouter>
      );
    };

    const wrapper = render(getWriterComponent());

    await act(async () => {
      const customerNameField = wrapper.getByTestId('customer-name').getElementsByTagName('input')[0];
      fireEvent.change(customerNameField, {
        target: { value: 'banana' },
      });
    });

    await act(async () => {
      const customerButton = wrapper.getByText(/banana/);
      fireEvent.click(customerButton);
    });

    await act(async () => {
      const engNameInput = wrapper.getByTestId('project-name');
      const regionInput = wrapper.getByTestId('region');
      const engagementType = wrapper.getByTestId('new-engagement-type');
      
      fireEvent.change(engNameInput, {
        target: { value: 'Mars Rover' },
      });

      fireEvent.change(regionInput, {
        target: { value: 'dev-1' },
      });

      fireEvent.change(engagementType, {
        target: { value: 'Residency'},
      });
    });

    await act(async () => {
      const engNameInput = wrapper.getByTestId('project-name');
      const regionInput = wrapper.getByTestId('region');
      const engagementType = wrapper.getByTestId('new-engagement-type');
    
      expect(engNameInput).toHaveValue('Mars Rover');
      expect(regionInput).toHaveValue('dev-1');
      expect(engagementType).toHaveValue('Residency');
      
      const createButton = wrapper.getByTestId('create-engagement-button');
      expect(createButton).toBeEnabled();
    });

    await act(async () => {
      const spy = jest.spyOn(fakey, 'createEngagement');

      const createButton = wrapper.getByTestId('create-engagement-button');
      fireEvent.click(createButton);

      expect(spy).toHaveBeenCalledWith({
        customer_name: 'banana',
        engagement_region: 'dev-1',
        engagement_type: 'Residency',
        project_name: 'Mars Rover',
      });
    });
  });
});

import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagements } from './engagement_hook';
import { getInitialState } from './engagement_form_reducer';
import { Engagement } from '../../schemas/engagement_schema';
import { TestStateWrapper } from '../../common/test_state_wrapper';

describe('Engagement Context', () => {
  const getHook = () => {
    const wrapper = ({ children }) => (
      <TestStateWrapper>{children}</TestStateWrapper>
    );
    return renderHook(() => useEngagements(), { wrapper });
  };

  afterEach(() => {
    cleanup();
  });

  test('Fetch Engagements', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current).toBeTruthy();
    expect(Array.isArray(result.current.engagements)).toBeTruthy();
    act(() => {
      result.current.getEngagements();
    });
    await waitForNextUpdate();

    expect(result.current.engagements.length).toBeGreaterThan(0);
  });

  test('Can Modify Engagement Form', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current.engagementFormState).toEqual(getInitialState());
    await act(async () => {
      result.current.updateEngagementFormField('customer_name', 'spencer');
      await waitForNextUpdate();
    });
    expect(result.current.engagementFormState.customer_name).toEqual('spencer');
  });

  test('Can switch engagements', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current.activeEngagement).toBe(undefined);
    await act(async () => {
      result.current.setActiveEngagement({ customer_name: 'spencer' } as any);
      await waitForNextUpdate();
    });
    expect(result.current.activeEngagement.customer_name).toEqual('spencer');
  });

  test('Form options update when setting active engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current.formOptions).toBe(undefined);
    await act(async () => {
      result.current.getConfig();
      await waitForNextUpdate();
    });
    expect(result.current.formOptions).toHaveProperty('providerOptions');
  });

  test('Form completeness for launch', async () => {
    const { result } = getHook();
    expect(result.current.isLaunchable).toBeFalsy();
  });

  test('Form is launchable when required fields are filled', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.setActiveEngagement(new Engagement({
        'customer_contact_email': 'funk@parliament.com',
        'customer_contact_name': 'hello',
        'customer_name': 'hello',
        'description': 'hello',
        'end_date': 'hello',
        'engagement_lead_email': 'hello',
        'engagement_lead_name': 'hello',
        'engagement_users': [],
        'location': 'hello',
        'ocp_cloud_provider_name': 'hello',
        'ocp_cloud_provider_region': 'hello',
        'ocp_cluster_size': 'hello',
        'ocp_persistent_storage_size': 'hello',
        'ocp_sub_domain': 'hello',
        'ocp_version': 'hello',
        'project_name': 'hello',
        'start_date': 'hello',
        'technical_lead_email': 'hello',
        'technical_lead_name': 'hello',
        'archive_date': null,
        'project_id': 1,
        'mongo_id': 'null',
        'launch': null
      }))
      await waitForNextUpdate;
    })
    expect(result.current.isLaunchable).toBeTruthy();
  });

  test('Can create a new engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current.engagements).toEqual([]);
    await act(async () => {
      result.current.createEngagement({
        customer_name: 'spencer',
      } as Engagement);
      await waitForNextUpdate();
    });
    expect(result.current.engagements.length).toEqual(1);
    expect(result.current.engagements[0].customer_name).toEqual('spencer');
    expect(result.current.activeEngagement.customer_name).toEqual('spencer');
  });
});

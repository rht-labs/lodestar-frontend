import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagements } from '../engagement_hook';
import { getInitialState } from '../engagement_form_reducer';
import { Engagement } from '../../../schemas/engagement_schema';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

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

  test('by default, engagements are undefined', () => {
    const { result } = getHook();
    expect(result.current.engagements).toEqual(undefined);
  });

  test('Fetch Engagements', async () => {
    const { result, waitForNextUpdate } = getHook();

    act(() => {
      result.current.getEngagements();
    });
    await waitForNextUpdate();

    expect(result.current.engagements.length).toBeGreaterThan(0);
  });

  test('by default, engagement form equals initial state', () => {
    const { result } = getHook();
    expect(result.current.currentEngagementChanges).toEqual(getInitialState());
  });

  test('Can Modify Engagement Form', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.updateEngagementFormField('customer_name', 'spencer');
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagementChanges.customer_name).toEqual(
      'spencer'
    );
  });

  test('Can switch engagements', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current.currentEngagement).toBe(undefined);
    await act(async () => {
      result.current.setCurrentEngagement({ customer_name: 'spencer' } as any);
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagement.customer_name).toEqual('spencer');
  });

  test('form options are undefined by default', () => {
    const { result } = getHook();
    expect(result.current.formOptions).toBe(undefined);
  });

  test('Form options update when setting active engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getConfig();
      await waitForNextUpdate();
    });
    expect(result.current.formOptions).toHaveProperty('cloud_options');
  });

  test('Form completeness for launch', async () => {
    const { result } = getHook();
    expect(result.current.isLaunchable).toBeFalsy();
  });

  test('Form is launchable when required fields are filled', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.setCurrentEngagement(Engagement.fromFake());
      await waitForNextUpdate;
    });
    expect(result.current.isLaunchable).toBeTruthy();
  });

  test('should not be launchable if one required field is not defined', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      const engagement = Engagement.fromFake();
      engagement.customer_contact_email = null;
      result.current.setCurrentEngagement(engagement);
      await waitForNextUpdate;
    });
    expect(result.current.isLaunchable).toBeFalsy();
  });

  test('Can create a new engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.createEngagement({
        customer_name: 'spencer',
      } as Engagement);
      await waitForNextUpdate();
    });
    expect(result.current.engagements[0].customer_name).toEqual('spencer');
  });
});

import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagements } from '../engagement_hook';
import { getInitialState } from '../engagement_form_reducer';
import { Engagement } from '../../../schemas/engagement';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { parse, addDays } from 'date-fns';
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

describe('Engagement date change logic', () => {
  const parseDate = (yyyyMMdd: string) => parse(yyyyMMdd, 'yyyy-MM-dd', 0);
  const getHook = () => {
    const wrapper = ({ children }) => (
      <TestStateWrapper>{children}</TestStateWrapper>
    );
    return renderHook(() => useEngagements(), { wrapper });
  };

  afterEach(() => {
    cleanup();
  });
  test('When the start date is greater than the end date, the end date should be set to the start date', async () => {
    const { result, waitForNextUpdate } = getHook();
    let end_date = parseDate('2020-01-01');
    let start_date = parseDate('2020-01-02');
    await act(async () => {
      result.current.updateEngagementFormField('end_date', end_date);
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagementChanges.end_date).toEqual(end_date);
    await act(async () => {
      result.current.updateEngagementFormField('start_date', start_date);
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagementChanges.end_date).toEqual(
      start_date
    );
  });
  test('When the start date is set, the archive date should automatically be set to the start date plus the default grace period', async () => {
    let start_date = parseDate('2020-01-02');
    // the mock formConfig should have the default grace period set to 30
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getConfig();
      await waitForNextUpdate();
    });
    await act(async () => {
      let archive_date = addDays(
        start_date,
        result.current.formOptions.logistics_options
          .env_default_grace_period as number
      );
      result.current.updateEngagementFormField('start_date', start_date);
      await waitForNextUpdate();
      expect(result.current.currentEngagementChanges.archive_date).toEqual(
        archive_date
      );
    });
  });
  test('When the end date is set to later than the archive date, the archive date should be set to the end date plus the default grace period', async () => {
    let archive_date = parseDate('2020-01-02');
    // the mock formConfig should have the default grace period set to 30
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getConfig();
      await waitForNextUpdate();
    });
    await act(async () => {
      result.current.updateEngagementFormField('archive_date', archive_date);
      await waitForNextUpdate();
    });
    await act(async () => {
      let end_date = addDays(archive_date, 1);
      result.current.updateEngagementFormField('end_date', end_date);
      await waitForNextUpdate();
      expect(result.current.currentEngagementChanges.archive_date).toEqual(
        addDays(
          end_date,
          result.current.formOptions.logistics_options
            .env_default_grace_period as number
        )
      );
    });
  });
  test('When the end date is changed such that the archive date is greater than the end date plus the max grace period, the archive date should equal the end date plus the max grace period', async () => {
    // the mock formConfig should have the default grace period set to 30
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getConfig();
      await waitForNextUpdate();
    });
    const maxGracePeriod = result.current.formOptions.logistics_options
      .env_grace_period_max as number;
    let end_date = parseDate('2020-01-02');
    let archive_date = addDays(end_date, maxGracePeriod);
    await act(async () => {
      result.current.updateEngagementFormField('end_date', end_date);
      await waitForNextUpdate();
    });
    await act(async () => {
      result.current.updateEngagementFormField('archive_date', archive_date);
      await waitForNextUpdate();
    });
    await act(async () => {
      end_date = addDays(end_date, -1);
      result.current.updateEngagementFormField('end_date', end_date);
      await waitForNextUpdate();
      expect(result.current.currentEngagementChanges.archive_date).toEqual(
        addDays(end_date, maxGracePeriod)
      );
    });
  });
});

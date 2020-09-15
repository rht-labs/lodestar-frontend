import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagements } from '../engagement_hook';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { parse, addDays } from 'date-fns';

describe('Engagement date change logic', () => {
  afterEach(() => cleanup());
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
        result.current.engagementFormConfig.logistics_options
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
          result.current.engagementFormConfig.logistics_options
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
    const maxGracePeriod = result.current.engagementFormConfig.logistics_options
      .env_grace_period_max;
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

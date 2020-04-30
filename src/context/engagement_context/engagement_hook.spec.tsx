import React from 'react';

import { renderHook, act } from '@testing-library/react-hooks';
import { FakedEngagementService } from '../../services/engagement_service/implementations/faked_engagement_service';
import { useEngagements } from './engagement_hook';

test('Fetch Engagements', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useEngagements({ engagementService: new FakedEngagementService() })
  );

  expect(result.current).toBeTruthy();
  expect(Array.isArray(result.current.engagements)).toBeTruthy();
  await act(async () => {
    jest.useFakeTimers();
    result.current.fetchEngagements();
    jest.runAllTimers();
    await waitForNextUpdate();
  });

  expect(result.current.engagements.length).toBeGreaterThan(0);
});

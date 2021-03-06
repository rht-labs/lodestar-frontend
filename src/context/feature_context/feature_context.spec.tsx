import React from 'react';
import { useFeatures } from './feature_hook';
import { act, renderHook } from '@testing-library/react-hooks';
import { FeatureToggles } from './feature_toggles';
import { TestStateWrapper } from '../../common/test_state_wrapper';

describe('Feature Context Hook', () => {
  const getHook = (features?: string[]) => {
    const wrapper = ({ children }) => (
      <TestStateWrapper>
        <FeatureToggles features={features}>{children}</FeatureToggles>
      </TestStateWrapper>
    );
    return renderHook(() => useFeatures(), { wrapper });
  };

  test('should be empty array when initialized without roles', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      expect(result.current.features.length).toEqual(0);
    });
  });

  test("should return false if it doesn't contain a given role", async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook(['foo', 'bar']);
      await waitForNextUpdate();
      expect(result.current.hasFeature('baz')).toBeFalsy();
    });
  });

  test('should return true if it does contain a given role', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook(['foo', 'bar']);
      await waitForNextUpdate();
      expect(result.current.hasFeature('foo')).toBeTruthy();
    });
  });
});

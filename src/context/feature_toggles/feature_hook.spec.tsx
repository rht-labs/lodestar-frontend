import { useFeatures } from './feature_hook';
import { renderHook } from '@testing-library/react-hooks';

describe('Feature Context Hook', () => {
  const getHook = (features?: string[]) =>
    renderHook(() => useFeatures(features));

  test('should be empty array when initialized without roles', () => {
    const { result } = getHook();
    expect(Array.isArray(result.current.features)).toBe(true);
    expect(result.current.features.length).toEqual(0);
  });

  test("should return false if it doesn't contain a given role", () => {
    const { result } = getHook(['foo', 'bar']);
    expect(result.current.hasFeature('baz')).toBeFalsy();
  });

  test('should return true if it does contain a given role', () => {
    const { result } = getHook(['foo', 'bar']);
    expect(result.current.hasFeature('foo')).toBeTruthy();
  });
});

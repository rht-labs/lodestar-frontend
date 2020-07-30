import React from 'react';
import { ModalVisibilityProvider } from '../edit_modal_visibility_context';
import { useModalVisibility } from '../edit_modal_visibility_hook';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-hooks';

describe('Edit modal visibility context', () => {
  const getHook = () => {
    const wrapper = ({ children }) => (
      <ModalVisibilityProvider>{children}</ModalVisibilityProvider>
    );
    return renderHook(() => useModalVisibility(), { wrapper });
  };
  test('when a modal is requested to be opened, it is made to be the active modal key', async () => {
    const { result, waitForNextUpdate } = getHook();
    const EXAMPLE_MODAL_KEY = 'examplemodalkey';
    await act(async () => {
      result.current.requestOpen(EXAMPLE_MODAL_KEY);
      await waitForNextUpdate();
    });
    expect(result.current.activeModalKey).toEqual(EXAMPLE_MODAL_KEY);
  });
  test('when a modal is closed, it is no longer the active modal key', async () => {
    const { result, waitForNextUpdate } = getHook();
    const EXAMPLE_MODAL_KEY = 'examplemodalkey';
    await act(async () => {
      result.current.requestOpen(EXAMPLE_MODAL_KEY);
      await waitForNextUpdate();
    });
    expect(result.current.activeModalKey).toEqual(EXAMPLE_MODAL_KEY);
    await act(async () => {
      result.current.requestClose();
      await waitForNextUpdate();
    });
    expect(result.current.activeModalKey).toBe(null);
  });
});

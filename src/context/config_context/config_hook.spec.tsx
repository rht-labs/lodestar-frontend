import { renderHook, cleanup, act } from '@testing-library/react-hooks';
import { useConfig } from './config_hook';
import { FakedConfigService } from '../../services/config_service/implementations/faked_config_service';

describe('Config Context Hook', () => {
  const getHook = () =>
    renderHook(() => useConfig({ configRepository: new FakedConfigService() }));
  afterEach(() => cleanup());
  test('Config is undefined by default', async () => {
    const { result } = getHook();

    expect(result.current.appConfig).toBe(undefined);
  });

  test('Expect fetchConfig to update app config', async () => {
    const { result, waitForNextUpdate } = getHook();

    await act(async () => {
      result.current.fetchConfig();
      await waitForNextUpdate();
    });

    expect(result.current.appConfig).not.toBe(undefined);
  });
});

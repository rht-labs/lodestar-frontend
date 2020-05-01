import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { FakedEngagementService } from '../../services/engagement_service/implementations/faked_engagement_service';
import { useEngagements } from './engagement_hook';
import { getInitialState } from './engagement_form_reducer';
import { Engagement } from '../../schemas/engagement_schema';

describe('Engagement Context', () => {
  const getHook = () =>
    renderHook(() =>
      useEngagements({ engagementService: new FakedEngagementService() })
    );

  afterEach(() => {
    cleanup();
  });

  test('Fetch Engagements', async () => {
    const { result, waitForNextUpdate, unmount } = getHook();
    expect(result.current).toBeTruthy();
    expect(Array.isArray(result.current.engagements)).toBeTruthy();
    act(() => {
      result.current.fetchEngagements();
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

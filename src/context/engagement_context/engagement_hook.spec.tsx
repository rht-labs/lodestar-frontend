import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { FakedEngagementService } from '../../services/engagement_service/implementations/faked_engagement_service';
import { useEngagements } from './engagement_hook';
import { getInitialState } from './engagement_form_reducer';

describe('Engagement Context', () => {
  afterEach(() => {
    cleanup();
  });
  test('Fetch Engagements', async () => {
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useEngagements({ engagementService: new FakedEngagementService() })
    );
    expect(result.current).toBeTruthy();
    expect(Array.isArray(result.current.engagements)).toBeTruthy();
    act(() => {
      result.current.fetchEngagements();
    });
    await waitForNextUpdate();

    expect(result.current.engagements.length).toBeGreaterThan(0);
  });

  test('Can Modify Engagement Form', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEngagements({ engagementService: new FakedEngagementService() })
    );
    expect(result.current.engagementFormState).toEqual(getInitialState());
    await act(async () => {
      result.current.updateEngagementFormField('customer_name', 'spencer');
      await waitForNextUpdate();
    });
    expect(result.current.engagementFormState.customer_name).toEqual('spencer');
    
  });
});

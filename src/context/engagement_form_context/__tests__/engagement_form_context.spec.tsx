import { useEngagementForm } from '../engagement_form_hook';
import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import {
  EngagementContext, EngagementProvider,
} from '../../engagement_context/engagement_context';
import { EngagementFormProvider } from '../engagement_form_context';
import { useEngagements } from '../../engagement_context/engagement_hook';
import { FakedEngagementService } from '../../../services/engagement_service/implementations/faked_engagement_service';
import { Engagement } from '../../../schemas/engagement';
import { wait } from '@testing-library/react';

describe('Engagement Form Context', () => {
  const getHook = (engagementContext: Partial<EngagementContext> = {}) => {
    const wrapper = ({ children }) => <EngagementFormProvider engagementContext={engagementContext as unknown as EngagementContext}>{children}</EngagementFormProvider>
    return renderHook(() => useEngagementForm(), { wrapper })
  }
  test('saveChanges should call engagementContext.saveEngagement', async () => {
    const spy = jest.fn();
    const wrapper = ({ children }) => (
      <EngagementContext.Provider value={{ saveEngagement: spy } as unknown as EngagementContext}>
        <EngagementContext.Consumer>
          {engagementContext => (
            <EngagementFormProvider engagementContext={engagementContext}>
              {children}
            </EngagementFormProvider>
          )}
        </EngagementContext.Consumer>
      </EngagementContext.Provider>
    );
    const { result, waitForNextUpdate } = renderHook(() => useEngagementForm(), { wrapper });

    await act(async () => {
      result.current.saveChanges();

      expect(spy).toHaveBeenCalled();
    });
  });
  test('can register a field group', async () => {
    const { result, waitForNextUpdate } = getHook()
    await act(async () => {
      result.current.setFieldGroups({ 'Hello': [] })
      await waitForNextUpdate()
      expect(result.current.fieldGroups).toStrictEqual({ 'Hello': [] })
    })
  });
  test('can update engagement fields', async () => {
    const { result, waitForNextUpdate } = getHook()
    await act(async () => {
      result.current.updateEngagementFormField('description', 'A handy description')
      await waitForNextUpdate()
      expect(result.current.currentChanges.description).toEqual('A handy description')
    })
  });
  test('saving an engagement should clear the current changes', async () => {
    const { result, waitForNextUpdate } = getHook({ saveEngagement: async () => { } })
    await act(async () => {
      result.current.updateEngagementFormField('description', 'a handy description')
      result.current.saveChanges()

      await waitForNextUpdate()
      expect(result.current.currentChanges?.description).toBeNull()
    })
  });
  test('calling clearCurrentChanges will clear the current changes', async () => {
    const { result, waitForNextUpdate } = getHook({})
    await act(async () => {
      result.current.updateEngagementFormField('description', 'a description')
      result.current.clearCurrentChanges()
      await waitForNextUpdate()
      expect(result.current.currentChanges?.description).toBeNull()
    })
  });

  test('when the current engagement changes in the engagement context, the currentChanges field should update to reflect that engagement', async () => {
    const wrapper = ({ children }) => {
      return <EngagementProvider feedbackContext={{}} engagementService={new FakedEngagementService()}>
        <EngagementContext.Consumer>
          {(engagementContext) =>
            <EngagementFormProvider engagementContext={engagementContext}>{children}</EngagementFormProvider>
          }
        </EngagementContext.Consumer>
      </EngagementProvider>
    }
    const { result, waitForNextUpdate, waitForValueToChange } = renderHook(() => ({ ...useEngagements(), ...useEngagementForm() }), { wrapper })
    await act(async () => {

      const newEngagement = Engagement.fromFake(true)
      expect(result.current.currentEngagement).toEqual(undefined)
      expect(result.current.currentChanges?.description).toBeNull()
      result.current.setCurrentEngagement(newEngagement)
      await waitForValueToChange(() => result.current.currentChanges.description)
      expect(result.current.currentChanges?.description).toBe("It's rocket science")
    })
  })
});

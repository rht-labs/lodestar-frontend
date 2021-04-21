import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagement } from '../engagement_hook';
import { Engagement } from '../../../schemas/engagement';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { EngagementService } from '../../../services/engagement_service/engagement_service';
import { EngagementProvider } from '../engagement_context';
import { AlreadyExistsError } from '../../../services/engagement_service/engagement_service_errors';
import { IFeedbackContext } from '../../feedback_context/feedback_context';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { CategoryService } from '../../../services/category_service/category_service';
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import { waitFor } from '@testing-library/react';
import { mockEngagementFormConfig } from '../../../mocks/engagement_form_config_mocks';

describe('Engagement Context', () => {
  const getHook = () => {
    const wrapper = ({ children }) => (
      <TestStateWrapper>{children}</TestStateWrapper>
    );
    return renderHook(() => useEngagement(), { wrapper });
  };

  afterEach(() => {
    cleanup();
  });
  const fakedFeedbackContext: IFeedbackContext = {
    alertActions: [],
    alertMsg: '',
    alertType: null,
    hideAlert: () => {},
    hideLoader: () => {},
    isLoaderVisible: false,
    showAlert: () => () => {},
    showLoader: () => {},
  };

  test('Can switch engagements', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      expect(result.current.currentEngagement).toBe(undefined);
      result.current.setCurrentEngagement({ customer_name: 'spencer' } as any);
      await waitForNextUpdate();
    });
  });

  test('Form completeness for launch', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      expect(result.current.isLaunchable).toBeFalsy();
    });
  });

  test('Form is launchable when required fields are filled', async () => {
    await act(async () => {
      const { result, waitForNextUpdate, waitFor } = getHook();
      await waitForNextUpdate();
      const engagement = Engagement.fromFake(true);
      result.current.setCurrentEngagement(engagement);

      await waitFor(() => expect(result.current.isLaunchable).toBeTruthy());
      expect(result.current.isLaunchable).toBeTruthy();
    });
  });

  test('the form is not launchable if the engagement fields are complete, but the dates are invalid', async () => {
    const engagement = Engagement.fromFake(true);
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      result.current.setCurrentEngagement({
        ...engagement,
        start_date: new Date(2020, 0, 1),
        end_date: new Date(2021, 0, 1),
      });
      await waitForNextUpdate();
      expect(result.current.isLaunchable).toBe(false);
    });
  });

  test('should not be launchable if one required field is not defined', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      const engagement = Engagement.fromFake();
      engagement.customer_contact_email = null;
      result.current.setCurrentEngagement(engagement);
      await waitForNextUpdate();
      expect(result.current.isLaunchable).toBeFalsy();
    });
  });

  test('should not be launchable if every added hosting environment is not complete and valid', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      const engagement = Engagement.fromFake(true);
      const invalidHe = HostingEnvironment.fromFake(true);
      const validHe = HostingEnvironment.fromFake(true);
      invalidHe.ocp_cluster_size = null;
      engagement.hosting_environments = [invalidHe, validHe];
      result.current.setCurrentEngagement(engagement);
      await waitForNextUpdate();
      expect(result.current.isLaunchable).toBeFalsy();
    });
  });
  test('launch is allowed if no hosting environment has been added', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      const engagement = Engagement.fromFake(true);
      engagement.hosting_environments = [];
      await waitForNextUpdate();
      result.current.setCurrentEngagement(engagement);
      await waitForNextUpdate();
      expect(result.current.isLaunchable).toBeTruthy();
    });
  });

  test('Can create a new engagement', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      result.current.createEngagement({
        customer_name: 'spencer',
      } as Engagement);
      await waitForNextUpdate();
      expect(result.current.currentEngagement.customer_name).toEqual('spencer');
    });
  });

  test("By default, an engagement uses the browser's timezone", async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      result.current.setCurrentEngagement({
        ...Engagement.fromFake(true),
        timezone: undefined,
      });
      await waitForNextUpdate();
      expect(result.current.currentChanges?.timezone).toBe('America/New_York');
    });
  });
  test('If an engagement has a timezone already defined, that timezone is not overridden when switching engagements', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      result.current.setCurrentEngagement({
        ...Engagement.fromFake(true),
        timezone: 'America/Los_Angeles',
      });
      await waitForNextUpdate();
      expect(result.current.currentChanges?.timezone).toBe(
        'America/Los_Angeles'
      );
    });
  });

  test('Can delete an engagement', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      const newEngagement = {
        customer_name: 'new engagement',
        uuid: '123',
      };
      result.current.createEngagement(newEngagement);
      await waitForNextUpdate();
      expect(result.current.currentEngagement).toEqual(newEngagement);

      result.current.deleteEngagement({
        uuid: '123',
      } as Engagement);
      await waitForNextUpdate();
      expect(result.current.currentEngagement).toBeUndefined();
    });
  });

  test('saveEngagement updates the current engagement when the save was successful', async () => {
    await act(async () => {
      const initialEngagement = Engagement.fromFake(true, {
        uniqueSuffix: '0',
      });
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      result.current.setCurrentEngagement(initialEngagement);
      await waitForNextUpdate();
      expect(result.current.currentEngagement).toEqual(initialEngagement);
      let modifiedEngagement = {
        ...initialEngagement,
        customer_contact_email: 'tennessee@nasa.gov',
      };
      result.current.saveEngagement(modifiedEngagement);
      await waitForNextUpdate();
      expect(result.current.currentEngagement).toEqual(modifiedEngagement);
    });
  });
  test('saveEngagement reverts to the initial engagement when the save was unsuccessful', async () => {
    const initialEngagement = Engagement.fromFake(true);
    const wrapper = ({ children }) => {
      return (
        <EngagementProvider
          categoryService={{} as CategoryService}
          engagementFormConfig={mockEngagementFormConfig()}
          feedbackContext={fakedFeedbackContext}
          engagementService={
            ({
              async checkSubdomainUniqueness() {
                return true;
              },
              async fetchEngagements() {
                return [initialEngagement];
              },
              async saveEngagement() {
                throw Error();
              },
            } as unknown) as EngagementService
          }
        >
          {children}
        </EngagementProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(() => useEngagement(), {
      wrapper,
    });
    result.current.setCurrentEngagement(initialEngagement);
    let modifiedEngagement = {
      ...initialEngagement,
      customer_contact_email: 'tennessee@nasa.gov',
    };
    await act(async () => {
      result.current.saveEngagement(modifiedEngagement);
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagement).toEqual(initialEngagement);
  });

  test('getEngagement fetches engagements when none are available', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      const engagement = await result.current.getEngagement(
        'NASA',
        'Boots on the Moon'
      );
      expect(engagement).toEqual(Engagement.fromFake(true));
    });
  });

  test('cannot launch an engagement whose fields are not completed', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      let error: any;
      await waitForNextUpdate();
      result.current
        .launchEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
      await waitForNextUpdate();
      expect(error.message).toBe(
        'This engagement does not have the required fields to launch'
      );
    });
  });
  test('can launch an engagement whose fields are completed', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      expect(result.current.isLaunchable).toBe(false);
      result.current.setCurrentEngagement({
        end_date: new Date(2021, 5, 1),
        start_date: new Date(2021, 1, 1),
        archive_date: new Date(2021, 5, 20),
        engagement_lead_email: 'abcd@cnn.com',
        engagement_lead_name: 'Frank EL',
        technical_lead_email: 'frank@fake.com',
        technical_lead_name: 'Frank techie',
        customer_contact_email: 'Contactme@company.com',
        customer_contact_name: 'Connie Contact',
        project_name: 'A fake project',
        customer_name: 'A fake customer',
        hosting_environments: [],
      } as Engagement);
      await waitForNextUpdate();
      expect(result.current.missingRequiredFields).toEqual([]);
      expect(result.current.isLaunchable).toBe(true);
    });
  });
  test('cannot launch an engagement whose fields are not completed', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate();
      const currentEngagement = Engagement.fromFake(true);
      delete currentEngagement.start_date;
      result.current.setCurrentEngagement(currentEngagement);
      await waitForNextUpdate();
      let error: any;
      result.current
        .launchEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
      await waitFor(() => expect(error).toBeDefined());
      expect(error.message).toBe(
        'This engagement does not have the required fields to launch'
      );
    });
  });
  test('can launch a completed engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.setCurrentEngagement(Engagement.fromFake(true));
    });
    await act(async () => {
      result.current.launchEngagement(Engagement.fromFake(true));
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagement.launch.launched_by).toBe(
      'A Nashvillian'
    );
  });
  test('a network error during launch reverts to the initial engagement object', async () => {
    const initialEngagement = Engagement.fromFake(true);
    const wrapper = ({ children }) => {
      return (
        <EngagementProvider
          categoryService={{} as CategoryService}
          engagementFormConfig={mockEngagementFormConfig()}
          feedbackContext={fakedFeedbackContext}
          engagementService={
            ({
              async fetchEngagements() {
                return [initialEngagement];
              },
              async checkSubdomainUniqueness() {
                return true;
              },
              async launchEngagement() {
                throw Error('a generic network error');
              },
            } as unknown) as EngagementService
          }
        >
          {children}
        </EngagementProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(() => useEngagement(), {
      wrapper,
    });
    const onCatch = jest.fn();
    await act(async () => {
      result.current.setCurrentEngagement(Engagement.fromFake(true));
      result.current.launchEngagement(Engagement.fromFake(true)).catch(onCatch);
      await waitForNextUpdate();
      await waitForNextUpdate();
      expect(onCatch).toHaveBeenCalled();
      expect(result.current.currentEngagement.launch).toBeFalsy();
    });
  });

  test('If an engagement already exists, an engagement should not be created', async () => {
    const initialEngagement = Engagement.fromFake(true);
    const wrapper = ({ children }) => {
      return (
        <EngagementProvider
          categoryService={{} as CategoryService}
          engagementFormConfig={mockEngagementFormConfig()}
          feedbackContext={fakedFeedbackContext}
          engagementService={
            ({
              async fetchEngagements() {
                return [initialEngagement];
              },
              async createEngagement() {
                throw new AlreadyExistsError();
              },
              async checkSubdomainUniqueness() {
                return true;
              },
            } as unknown) as EngagementService
          }
        >
          {children}
        </EngagementProvider>
      );
    };
    const { result } = renderHook(() => useEngagement(), {
      wrapper,
    });
    let error: any;
    await act(async () => {
      result.current
        .createEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
    });
    expect(error).toBeInstanceOf(AlreadyExistsError);
  });

  test('When a new engagement is successfully created, it should be set as the current engagement', async () => {
    const newEngagement: Partial<Engagement> = {
      customer_name: 'New Customer name',
      project_name: 'New Project',
    };
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.createEngagement(newEngagement);
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagement).toEqual(newEngagement);
  });

  afterAll(cleanup);
});

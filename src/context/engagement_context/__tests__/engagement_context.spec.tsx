import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagements } from '../engagement_hook';
import { Engagement } from '../../../schemas/engagement';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import {
  AuthContext,
  AuthProvider,
  IAuthContext,
  useSession,
} from '../../auth_context/auth_context';
import { EngagementService } from '../../../services/engagement_service/engagement_service';
import { EngagementProvider } from '../engagement_context';
import { UserToken } from '../../../schemas/user_token';
import { UserProfile } from '../../../schemas/user_profile';
import { AuthenticationError } from '../../../services/auth_service/auth_errors';
import { AuthService } from '../../../services/auth_service/authentication_service';
import { AlreadyExistsError } from '../../../services/engagement_service/engagement_service_errors';
import {
  FeedbackContext,
  FeedbackProvider,
  IFeedbackContext,
} from '../../feedback_context/feedback_context';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { CategoryService } from '../../../services/category_service/category_service';

describe('Engagement Context', () => {
  const getHook = () => {
    const wrapper = ({ children }) => (
      <TestStateWrapper>{children}</TestStateWrapper>
    );
    return renderHook(() => useEngagements(), { wrapper });
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

  test('by default, engagements are an empty array', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      expect(result.current.engagements).toEqual([]);
    });
  });

  test('Fetch Engagements', async () => {
    const { result, waitForNextUpdate } = getHook();

    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
      expect(result.current.engagements.length).toBeGreaterThan(0);
    });
  });

  test('Can switch engagements', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      expect(result.current.currentEngagement).toBe(undefined);
      result.current.setCurrentEngagement({ customer_name: 'spencer' } as any);
      await waitForNextUpdate();
    });
  });

  test('Form completeness for launch', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      expect(result.current.isLaunchable).toBeFalsy();
    });
  });

  test('Form is launchable when required fields are filled', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      result.current.setCurrentEngagement(Engagement.fromFake());
      await waitForNextUpdate;
      await waitForNextUpdate;
      expect(result.current.isLaunchable).toBeTruthy();
    });
  });

  test('should not be launchable if one required field is not defined', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      const engagement = Engagement.fromFake();
      engagement.customer_contact_email = null;
      result.current.setCurrentEngagement(engagement);
      await waitForNextUpdate;
      expect(result.current.isLaunchable).toBeFalsy();
    });
  });

  test('should not be launchable if every added hosting environment is not complete and valid', async () => {
    expect(true).toBe(false);
  });
  test('launch is allowed if no hosting environment has been added', async () => {
    expect(true).toBe(false);
  });

  test('Can create a new engagement', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      result.current.createEngagement({
        customer_name: 'spencer',
      } as Engagement);
      await waitForNextUpdate();
      expect(result.current.engagements[0].customer_name).toEqual('spencer');
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
      await waitForNextUpdate;
      result.current.createEngagement({
        customer_name: 'new engagement',
        uuid: '123'
      } as Engagement);
      await waitForNextUpdate();
      expect(result.current.engagements?.length).toEqual(1);

      await waitForNextUpdate();
      result.current.deleteEngagement({
        uuid: '123'
      } as Engagement);
      await waitForNextUpdate();
      expect(result.current.engagements?.length).toEqual(0);
    });
  });

  test('_handleErrors handles authentication errors', async () => {
    await act(async () => {
      const isLoggedIn = jest.fn(async () => true);
      const wrapper = ({ children }) => {
        return (
          <FeedbackProvider>
            <FeedbackContext.Consumer>
              {feedbackContext => (
                <AuthProvider
                  authService={
                    ({
                      isLoggedIn,
                      getToken() {
                        return UserToken.fromFake();
                      },
                      async getUserProfile() {
                        return UserProfile.fromFake();
                      },
                    } as unknown) as AuthService
                  }
                >
                  <AuthContext.Consumer>
                    {authContext => (
                      <EngagementProvider
                        engagementFormConfig={EngagementFormConfig.fromFake()}
                        categoryService={{} as CategoryService}
                        authContext={authContext}
                        feedbackContext={feedbackContext}
                        engagementService={
                          ({
                            async checkSubdomainUniqueness(s) {
                              return true;
                            },
                            async fetchEngagements() {
                              throw new AuthenticationError();
                            },
                          } as unknown) as EngagementService
                        }
                      >
                        {children}
                      </EngagementProvider>
                    )}
                  </AuthContext.Consumer>
                </AuthProvider>
              )}
            </FeedbackContext.Consumer>
          </FeedbackProvider>
        );
      };
      const { result, waitForNextUpdate } = renderHook(() => useEngagements(), {
        wrapper,
      });
      await waitForNextUpdate;
      await result.current.getEngagements();
      expect(isLoggedIn).toHaveBeenCalledTimes(1);
    });
  });
  test('_handleErrors rethrows errors that it does not recognize', async () => {
    const wrapper = ({ children }) => {
      return (
        <FeedbackProvider>
          <FeedbackContext.Consumer>
            {feedbackContext => (
              <AuthProvider
                authService={
                  ({
                    async isLoggedIn() {
                      return true;
                    },
                    getToken() {
                      return UserToken.fromFake();
                    },
                    async getUserProfile() {
                      return UserProfile.fromFake();
                    },
                  } as unknown) as AuthService
                }
              >
                <EngagementProvider
                  engagementFormConfig={EngagementFormConfig.fromFake()}
                  authContext={{} as IAuthContext}
                  categoryService={{} as CategoryService}
                  feedbackContext={feedbackContext}
                  engagementService={
                    ({
                      async checkSubdomainUniqueness(s) {
                        return true;
                      },
                      async fetchEngagements() {
                        throw new Error('just a random error');
                      },
                    } as unknown) as EngagementService
                  }
                >
                  {children}
                </EngagementProvider>
              </AuthProvider>
            )}
          </FeedbackContext.Consumer>
        </FeedbackProvider>
      );
    };
    const { result } = renderHook(() => useEngagements(), {
      wrapper,
    });
    const onCaught = jest.fn();
    await act(async () => {
      result.current.getEngagements().catch(onCaught);
    });
    expect(onCaught).toHaveBeenCalledTimes(1);
  });
  test("_validateAuthStatus updates authContext's hasError if it encounters an AuthenticationError", async () => {
    const wrapper = ({ children }) => {
      return (
        <FeedbackProvider>
          <FeedbackContext.Consumer>
            {feedbackContext => (
              <AuthProvider
                authService={
                  ({
                    async isLoggedIn() {
                      return false;
                    },
                    getToken() {
                      return UserToken.fromFake();
                    },
                    async getUserProfile() {
                      return UserProfile.fromFake();
                    },
                  } as unknown) as AuthService
                }
              >
                <AuthContext.Consumer>
                  {authContext => (
                    <EngagementProvider
                      categoryService={{} as CategoryService}
                      engagementFormConfig={EngagementFormConfig.fromFake()}
                      feedbackContext={feedbackContext}
                      authContext={authContext}
                      engagementService={
                        ({
                          async checkSubdomainUniqueness(s) {
                            return true;
                          },
                          async fetchEngagements() {
                            return [];
                          },
                        } as unknown) as EngagementService
                      }
                    >
                      {children}
                    </EngagementProvider>
                  )}
                </AuthContext.Consumer>
              </AuthProvider>
            )}
          </FeedbackContext.Consumer>
        </FeedbackProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(
      () => ({ engagements: useEngagements(), auth: useSession() }),
      {
        wrapper,
      }
    );
    let error;

    await act(async () => {
      result.current.engagements.getEngagements();
      await waitForNextUpdate();
    });
    expect(result.current.auth.authError).toBeInstanceOf(AuthenticationError);
  });

  test('saveEngagement updates the current engagement when the save was successful', async () => {
    await act(async () => {
      const initialEngagement = Engagement.fromFake(true, {
        uniqueSuffix: '0',
      });
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
      result.current.getEngagements();
      await waitForNextUpdate();
      result.current.setCurrentEngagement(result.current.engagements[0]);
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
        <AuthProvider
          authService={
            ({
              async isLoggedIn() {
                return true;
              },
              getToken() {
                return UserToken.fromFake();
              },
              async getUserProfile() {
                return UserProfile.fromFake();
              },
            } as unknown) as AuthService
          }
        >
          <AuthContext.Consumer>
            {authContext => (
              <EngagementProvider
                categoryService={{} as CategoryService}
                engagementFormConfig={EngagementFormConfig.fromFake()}
                authContext={authContext}
                feedbackContext={fakedFeedbackContext}
                engagementService={
                  ({
                    async checkSubdomainUniqueness(s) {
                      return true;
                    },
                    async fetchEngagements() {
                      return [initialEngagement];
                    },
                    async saveEngagement(engagement) {
                      throw Error();
                    },
                  } as unknown) as EngagementService
                }
              >
                {children}
              </EngagementProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(() => useEngagements(), {
      wrapper,
    });
    await act(async () => {
      await result.current.getEngagements();
    });
    expect(result.current.engagements[0]).toEqual(initialEngagement);
    let modifiedEngagement = {
      ...initialEngagement,
      customer_contact_email: 'tennessee@nasa.gov',
    };
    await act(async () => {
      result.current.saveEngagement(modifiedEngagement);
      await waitForNextUpdate();
    });
    expect(result.current.engagements[0]).toEqual(initialEngagement);
  });

  test('getEngagement fetches engagements when none are available', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = getHook();
      await waitForNextUpdate;
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
      let error;
      await waitForNextUpdate;
      result.current
        .launchEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
      await waitForNextUpdate;
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
      result.current.getEngagements();
      await waitForNextUpdate();
      const currentEngagement = Engagement.fromFake(true);
      delete currentEngagement.start_date;
      result.current.setCurrentEngagement(currentEngagement);
      let error;
      result.current
        .launchEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
      await waitForNextUpdate();
      expect(error.message).toBe(
        'This engagement does not have the required fields to launch'
      );
    });
  });
  test('can launch a completed engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
    });
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
        <AuthProvider
          authService={
            ({
              async isLoggedIn() {
                return true;
              },
              getToken() {
                return UserToken.fromFake();
              },
              async getUserProfile() {
                return UserProfile.fromFake();
              },
            } as unknown) as AuthService
          }
        >
          <AuthContext.Consumer>
            {authContext => (
              <EngagementProvider
                categoryService={{} as CategoryService}
                engagementFormConfig={EngagementFormConfig.fromFake()}
                authContext={authContext}
                feedbackContext={fakedFeedbackContext}
                engagementService={
                  ({
                    async fetchEngagements() {
                      return [initialEngagement];
                    },
                    async checkSubdomainUniqueness(s) {
                      return true;
                    },
                    async launchEngagement(engagement) {
                      throw Error('a generic network error');
                    },
                  } as unknown) as EngagementService
                }
              >
                {children}
              </EngagementProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(() => useEngagements(), {
      wrapper,
    });
    const onCatch = jest.fn();
    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
    });
    await act(async () => {
      result.current.setCurrentEngagement(Engagement.fromFake(true));
      result.current.launchEngagement(Engagement.fromFake(true)).catch(onCatch);
      await waitForNextUpdate();
      expect(onCatch).toHaveBeenCalled();
      expect(result.current.currentEngagement.launch).toBeFalsy();
    });
  });

  test('If an engagement already exists, an engagement should not be created', async () => {
    const initialEngagement = Engagement.fromFake(true);
    const wrapper = ({ children }) => {
      return (
        <AuthProvider
          authService={
            ({
              async isLoggedIn() {
                return true;
              },
              getToken() {
                return UserToken.fromFake();
              },
              async getUserProfile() {
                return UserProfile.fromFake();
              },
            } as unknown) as AuthService
          }
        >
          <AuthContext.Consumer>
            {authContext => (
              <EngagementProvider
                categoryService={{} as CategoryService}
                engagementFormConfig={EngagementFormConfig.fromFake()}
                authContext={authContext}
                feedbackContext={fakedFeedbackContext}
                engagementService={
                  ({
                    async fetchEngagements() {
                      return [initialEngagement];
                    },
                    async createEngagement(engagement) {
                      throw new AlreadyExistsError();
                    },
                    async checkSubdomainUniqueness(s) {
                      return true;
                    },
                  } as unknown) as EngagementService
                }
              >
                {children}
              </EngagementProvider>
            )}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    };
    const { result } = renderHook(() => useEngagements(), {
      wrapper,
    });
    let error;
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

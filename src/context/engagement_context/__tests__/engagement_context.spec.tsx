import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useEngagements } from '../engagement_hook';
import { getInitialState } from '../engagement_form_reducer';
import { Engagement } from '../../../schemas/engagement';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { AuthProvider } from '../../auth_context/auth_context';
import { EngagementService } from '../../../services/engagement_service/engagement_service';
import { EngagementProvider } from '../engagement_context';
import { UserToken } from '../../../schemas/user_token';
import { UserProfile } from '../../../schemas/user_profile';
import { AuthenticationError } from '../../../services/auth_service/auth_errors';
import { AuthService } from '../../../services/auth_service/authentication_service';
import { AlreadyExistsError } from '../../../services/engagement_service/engagement_service_errors';
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

  test('by default, engagements are undefined', () => {
    const { result } = getHook();
    expect(result.current.engagements).toEqual(undefined);
  });

  test('Fetch Engagements', async () => {
    const { result, waitForNextUpdate } = getHook();

    act(() => {
      result.current.getEngagements();
    });
    await waitForNextUpdate();

    expect(result.current.engagements.length).toBeGreaterThan(0);
  });

  test('by default, engagement form equals initial state', () => {
    const { result } = getHook();
    expect(result.current.currentEngagementChanges).toEqual(getInitialState());
  });

  test('Can Modify Engagement Form', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.updateEngagementFormField('customer_name', 'spencer');
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagementChanges.customer_name).toEqual(
      'spencer'
    );
  });

  test('Can switch engagements', async () => {
    const { result, waitForNextUpdate } = getHook();
    expect(result.current.currentEngagement).toBe(undefined);
    await act(async () => {
      result.current.setCurrentEngagement({ customer_name: 'spencer' } as any);
      await waitForNextUpdate();
    });
    expect(result.current.currentEngagement.customer_name).toEqual('spencer');
  });

  test('form options are undefined by default', () => {
    const { result } = getHook();
    expect(result.current.formOptions).toBe(undefined);
  });

  test('Form options update when setting active engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getConfig();
      await waitForNextUpdate();
    });
    expect(result.current.formOptions).toHaveProperty('cloud_options');
  });

  test('Form completeness for launch', async () => {
    const { result } = getHook();
    expect(result.current.isLaunchable).toBeFalsy();
  });

  test('Form is launchable when required fields are filled', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.setCurrentEngagement(Engagement.fromFake());
      await waitForNextUpdate;
    });
    expect(result.current.isLaunchable).toBeTruthy();
  });

  test('should not be launchable if one required field is not defined', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      const engagement = Engagement.fromFake();
      engagement.customer_contact_email = null;
      result.current.setCurrentEngagement(engagement);
      await waitForNextUpdate;
    });
    expect(result.current.isLaunchable).toBeFalsy();
  });

  test('Can create a new engagement', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.createEngagement({
        customer_name: 'spencer',
      } as Engagement);
      await waitForNextUpdate();
    });
    expect(result.current.engagements[0].customer_name).toEqual('spencer');
  });

  test('_handleErrors handles authentication errors', async () => {
    const isLoggedIn = jest.fn(async () => true);
    const wrapper = ({ children }) => {
      return (
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
          <EngagementProvider
            engagementService={
              ({
                async fetchEngagements() {
                  throw new AuthenticationError();
                },
              } as unknown) as EngagementService
            }
          >
            {children}
          </EngagementProvider>
        </AuthProvider>
      );
    };
    const { result } = renderHook(() => useEngagements(), {
      wrapper,
    });
    await act(async () => {
      result.current.getEngagements();
    });
    expect(isLoggedIn).toHaveBeenCalledTimes(2);
  });
  test('_handleErrors rethrows errors that it does not recognize', async () => {
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
          <EngagementProvider
            engagementService={
              ({
                async fetchEngagements() {
                  throw new Error('just a random error');
                },
              } as unknown) as EngagementService
            }
          >
            {children}
          </EngagementProvider>
        </AuthProvider>
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
  test('_validateAuthStatus throws an AuthenticationError if the user is not authenticated', async () => {
    const wrapper = ({ children }) => {
      return (
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
          <EngagementProvider
            engagementService={
              ({
                async fetchEngagements() {
                  return [];
                },
              } as unknown) as EngagementService
            }
          >
            {children}
          </EngagementProvider>
        </AuthProvider>
      );
    };
    const { result } = renderHook(() => useEngagements(), {
      wrapper,
    });
    let error;

    await act(async () => {
      result.current.getEngagements().catch(e => (error = e));
    });
    expect(error).toBeInstanceOf(AuthenticationError);
  });

  test('saveEngagement updates the current engagement when the save was successful', async () => {
    const initialEngagement = Engagement.fromFake(true);
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
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
    expect(result.current.engagements[0]).toEqual(modifiedEngagement);
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
          <EngagementProvider
            engagementService={
              ({
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
        </AuthProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(() => useEngagements(), {
      wrapper,
    });
    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
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
    const { result } = getHook();
    await act(async () => {
      const engagement = await result.current.getEngagement(
        'NASA',
        'Boots on the Moon'
      );
      expect(engagement).toEqual(Engagement.fromFake(true));
    });
  });

  test('cannot launch an engagement whose fields are not completed', async () => {
    const { result } = getHook();
    let error;
    await act(async () => {
      result.current
        .launchEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
    });
    expect(error.message).toBe(
      'This engagement does not have the required fields to launch'
    );
  });
  test('cannot launch an engagement whose fields are not completed', async () => {
    const { result, waitForNextUpdate } = getHook();
    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
    });
    const currentEngagement = Engagement.fromFake(true);
    delete currentEngagement.start_date;
    await act(async () => {
      result.current.setCurrentEngagement(currentEngagement);
    });
    let error;
    await act(async () => {
      result.current
        .launchEngagement(Engagement.fromFake(true))
        .catch(e => (error = e));
    });
    expect(error.message).toBe(
      'This engagement does not have the required fields to launch'
    );
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
          <EngagementProvider
            engagementService={
              ({
                async fetchEngagements() {
                  return [initialEngagement];
                },
                async launchEngagement(engagement) {
                  throw Error('a generic network error');
                },
              } as unknown) as EngagementService
            }
          >
            {children}
          </EngagementProvider>
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
    });
    await act(async () => {
      result.current.launchEngagement(Engagement.fromFake(true)).catch(onCatch);
      await waitForNextUpdate();
    });
    expect(onCatch).toHaveBeenCalled();
    expect(result.current.currentEngagement.launch).toBeFalsy();
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
          <EngagementProvider
            engagementService={
              ({
                async fetchEngagements() {
                  return [initialEngagement];
                },
                async createEngagement(engagement) {
                  throw new AlreadyExistsError();
                },
              } as unknown) as EngagementService
            }
          >
            {children}
          </EngagementProvider>
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

  test('If an engagement has changed since the last update, the engagement should revert to the old engagement', async () => {
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
          <EngagementProvider
            engagementService={
              ({
                async fetchEngagements() {
                  return [initialEngagement];
                },
                async saveEngagement(engagement) {
                  throw new AlreadyExistsError();
                },
              } as unknown) as EngagementService
            }
          >
            {children}
          </EngagementProvider>
        </AuthProvider>
      );
    };
    const { result, waitForNextUpdate } = renderHook(() => useEngagements(), {
      wrapper,
    });
    await act(async () => {
      result.current.getEngagements();
      await waitForNextUpdate();
    });
    await act(async () => {
      result.current.setCurrentEngagement(result.current.engagements[0]);
      await waitForNextUpdate();
    });
    const modifiedEngagement = {
      ...initialEngagement,
      customer_contact_email: 'madeup@example.com',
    };
    await act(async () => {
      result.current.saveEngagement(modifiedEngagement);
    });

    expect(result.current.currentEngagement).toEqual(initialEngagement);
  });
  afterAll(cleanup);
});

import React from 'react';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { Feature } from '../feature';
import { AppFeature } from '../../../common/app_features';
import { render, act } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { AuthContext } from '../../../context/auth_context/auth_context';
import { VersionContext } from '../../../context/version_context/version_context';

describe('Feature component', () => {
  test('should render inactive component if role is not present', async () => {
    act(async () => {
      function Wrapper({ children }) {
        return (
          <TestStateWrapper>
            <AuthContext.Consumer>
              {authContext => (
                <VersionContext.Consumer>
                  {versionContext => (
                    <FeatureToggles
                      authContext={authContext}
                      versionContext={versionContext}
                      features={['foo']}
                    >
                      {children}
                    </FeatureToggles>
                  )}
                </VersionContext.Consumer>
              )}
            </AuthContext.Consumer>
          </TestStateWrapper>
        );
      }
      const { findByTestId } = render(
        <Wrapper>
          <Feature
            name={'bar' as AppFeature}
            inactiveComponent={() => <div data-testid="inactive" />}
          >
            <div data-testid="active"></div>
          </Feature>
        </Wrapper>
      );
      expect(await findByTestId('inactive')).toBeInTheDocument();
    });
  });

  test('should render the active component when the role is present', async () => {
    act(async () => {
      function Wrapper({ children }) {
        return (
          <TestStateWrapper>
            <AuthContext.Consumer>
              {authContext => (
                <VersionContext.Consumer>
                  {versionContext => (
                    <FeatureToggles
                      authContext={authContext}
                      versionContext={versionContext}
                      features={['foo']}
                    >
                      {children}
                    </FeatureToggles>
                  )}
                </VersionContext.Consumer>
              )}
            </AuthContext.Consumer>
          </TestStateWrapper>
        );
      }
      const { findByTestId } = render(
        <Wrapper>
          <Feature
            name={'foo' as AppFeature}
            inactiveComponent={() => <div data-testid="inactive" />}
          >
            <div data-testid="active"></div>
          </Feature>
        </Wrapper>
      );
      expect(await findByTestId('active')).toBeInTheDocument();
    });
  });
});

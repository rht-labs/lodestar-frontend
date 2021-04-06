import React from 'react';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { Feature } from '../feature';
import { AppFeature } from '../../../common/app_features';
import { render, act } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Feature component', () => {
  test('should render inactive component if role is not present', async () => {
    act(async () => {
      function Wrapper({ children }) {
        return (
          <TestStateWrapper>
            <FeatureToggles features={['foo']}>{children}</FeatureToggles>
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
            <FeatureToggles features={['foo']}>{children}</FeatureToggles>
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

import React from 'react';
import { FeatureToggles } from '../context/feature_toggles/feature_toggles';
import '@testing-library/jest-dom/extend-expect';
import { Feature } from './feature';
import { AppFeature } from '../common/app_features';
import { render } from '@testing-library/react';

const Wrapper = ({ children }) => (
  <FeatureToggles features={['foo']}>{children}</FeatureToggles>
);

describe('Feature component', () => {
  test('should render inactive component if role is not present', () => {
    const { getByTestId } = render(
      <Wrapper>
        <Feature
          name={'bar' as AppFeature}
          inactiveComponent={() => <div data-testid="inactive" />}
        >
          <div data-testid="active"></div>
        </Feature>
      </Wrapper>
    );
    expect(getByTestId('inactive')).toBeInTheDocument();
  });

  test('should render the active component when the role is present', () => {
    const { getByTestId } = render(
      <Wrapper>
        <Feature
          name={'foo' as AppFeature}
          inactiveComponent={() => <div data-testid="inactive" />}
        >
          <div data-testid="active"></div>
        </Feature>
      </Wrapper>
    );
    expect(getByTestId('active')).toBeInTheDocument();
  });
});

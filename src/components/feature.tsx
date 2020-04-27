import React, { useContext } from 'react';
import { FeatureToggleContext } from '../context/feature_toggles';
import { AppFeature } from '../common/app_features';

export interface FeatureProps {
  children: React.ReactNode;
  inactiveComponent?: React.ComponentType<any>;
  name: AppFeature;
}
export const Feature = ({
  inactiveComponent: Component,
  name,
  ...props
}: FeatureProps) => {
  const { hasFeature } = useContext(FeatureToggleContext);
  if (hasFeature(name)) {
    return <>{props.children}</>;
  }
  return Component ? <Component {...props} /> : null;
};

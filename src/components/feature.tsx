import React, { useContext } from 'react';
import { FeatureToggleContext } from '../context/feature_toggles';

export interface FeatureProps {
  children: React.ReactNode;
  inactiveComponent: React.ComponentType<any>;
  name: string;
}
export const Feature = ({
  inactiveComponent: Component,
  ...props
}: FeatureProps) => {
  const { features } = useContext(FeatureToggleContext);
  if (features.includes(props.name)) {
    return <>{props.children}</>;
  }
  return <Component {...props} />;
};

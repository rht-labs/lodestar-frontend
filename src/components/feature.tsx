import React, { useContext } from 'react';
import { FeatureToggleContext } from '../context/feature_toggles';

export interface FeatureProps {
  children: React.ReactNode;
  inactiveComponent: React.ReactNode;
  name: string;
}
export const Feature = (props: FeatureProps) => {
  const { features } = useContext(FeatureToggleContext);
  if (features.includes(props.name)) {
    return props.children;
  }
  return props.inactiveComponent;
};

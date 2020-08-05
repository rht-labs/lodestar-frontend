import React from 'react';
import { AppFeature } from '../../common/app_features';
import { useFeatures } from '../../context/feature_context/feature_hook';

export interface FeatureProps {
  children: React.ReactNode;
  inactiveComponent?: React.ComponentType<any>;
  name?: AppFeature;
}

/**
 *
 * By default, Feature shows the feature-protected component if the feature name provided
 * is included in the current user's roles, or if there is no feature name provided at all.
 *
 * The reason for showing the feature if there is no feature name is to allow developers to
 * proactively wrap product features in a Feature component and add the flag later.
 */
export const Feature = ({
  inactiveComponent: Component,
  name,
  ...props
}: FeatureProps) => {
  const { hasFeature } = useFeatures();
  if (!name) {
  }
  if (!name || hasFeature(name)) {
    return <>{props.children}</>;
  }
  return Component ? <Component {...props} /> : null;
};

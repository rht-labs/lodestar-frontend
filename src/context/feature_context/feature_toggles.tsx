import React, { useCallback, useEffect, useState } from 'react';
import {
  getFeaturesFromVersion,
  FEATURE_VERSION_MAP,
} from '../../common/version_feature_factory';
import { IAuthContext } from '../auth_context/auth_context';
import { IVersionContext } from '../version_context/version_context';

interface IFeatureToggleContext {
  features: string[];
  isLoading: boolean;
  hasFeature: (name: string) => boolean;
}

export const FeatureToggleContext = React.createContext<IFeatureToggleContext>({
  features: [],
  hasFeature: () => false,
  isLoading: false,
});

export interface IFeatureToggleProvider {
  features?: string[];
  authContext: IAuthContext;
  versionContext: IVersionContext;
  children: any;
}

export const FeatureToggles = ({
  children,
  features,
  authContext,
  versionContext,
}: IFeatureToggleProvider) => {
  const versionFeatures = getFeaturesFromVersion(
    versionContext?.versions?.mainVersion?.value,
    FEATURE_VERSION_MAP
  );
  const roleFeatures = (authContext?.sessionData?.roles ?? []).concat(
    features ?? []
  );
  const [hasFetchedVersions, setHasFetchedVersions] = useState(false);
  useEffect(() => {
    if (!hasFetchedVersions) {
      versionContext?.fetchVersions();
      setHasFetchedVersions(true);
    }
  }, [versionContext, hasFetchedVersions]);
  const allFeatures = React.useMemo(
    () => [...versionFeatures, ...roleFeatures],
    [versionFeatures, roleFeatures]
  );
  const hasFeature = useCallback(
    (name: string) => {
      return name && allFeatures.includes(name);
    },
    [allFeatures]
  );
  const isLoading = !versionContext?.versions;

  return (
    <FeatureToggleContext.Provider
      value={{ features: allFeatures, hasFeature, isLoading }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};

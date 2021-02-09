import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  getFeaturesFromVersion,
  FEATURE_VERSION_MAP,
} from '../../common/version_feature_factory';
import { IAuthContext } from '../auth_context/auth_context';
import { IVersionContext } from '../version_context/version_context';
import qs from 'query-string';
import { Config } from '../../schemas/config';

export interface IFeatureToggleContext {
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
  config?: Config;
  children: any;
}

export const FeatureToggles = ({
  children,
  features,
  authContext,
  versionContext,
  config,
}: IFeatureToggleProvider) => {
  let version = versionContext?.versions?.mainVersion?.value;

  const location = useLocation();
  if (config?.allowVersionOverride) {
    const query = qs.parse(location.search);
    const queryVersion = query['lodestar-version'];
    if (queryVersion) {
      version = Array.isArray(queryVersion) ? queryVersion[0] : queryVersion;
    }
  }
  const versionFeatures = getFeaturesFromVersion(version, FEATURE_VERSION_MAP);
  const roleFeatures = (authContext?.sessionData?.roles ?? []).concat(
    features ?? []
  );
  const [hasFetchedVersions, setHasFetchedVersions] = useState(false);
  useEffect(() => {
    if (!hasFetchedVersions) {
      versionContext?.fetchVersions?.();
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
